"use client";

import ImageUploader from "@/components/controllers/ImageUploader";
import { EditorMenuContent } from "@/components/editor/editor-context-menu";
import {
  ContextMenu,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";
import {
  DYNAMIC_LOGO_IMG_STYLE_DEFAULTS,
  DYNAMIC_LOGO_STYLE_DEFAULTS,
} from "@/store/styleManager/defaults";
import { useStyleProp } from "@/store/styleManager/styleManager";
import type { CssValue } from "@/types/css.type";
import { useEffect, useRef, useState } from "react";
import {
  DYNAMIC_LOGO_DEFAULT_POSITION,
  DYNAMIC_LOGO_DEFAULT_SCALE_PERCENT,
  DYNAMIC_LOGO_IMG_SELECTOR,
  DYNAMIC_LOGO_SELECTOR,
  type LogoCorner,
} from "./dynamic-logo.constants";
import { DynamicLogoHitZone } from "./dynamic-logo-hit-zone";
import { DynamicLogoMenu } from "./dynamic-logo-menu";
import { DynamicLogoStyles } from "./dynamic-logo-styles";
import {
  backgroundSizePxToScale,
  clearNaturalWidthCache,
  clampScalePercent,
  extractBackgroundImageUrl,
  formatLogoPosition,
  getCachedNaturalHeight,
  getCachedNaturalWidth,
  hasCustomLogoImage,
  loadImageNaturalWidth,
  logoCornerPreset,
  nudgeLogoPosition,
  parseLogoPosition,
  sanitizeOffset,
  scaleToBackgroundSizePx,
} from "./dynamic-logo.utils";
import { toBackgroundImageCssValue } from "../timeline-background/timeline-background.utils";

type DynamicLogoProps = {
  isLoggingIn: boolean;
};

/**
 * 用途：噗寶（#dynamic_logo）feature wrapper。
 *
 * 巢狀 ContextMenu 吃掉右鍵，避免出現河道背景／裝飾選單。
 * 自訂圖／大小／位置寫入 styleManager；natural size 快取後再寫 background-size px。
 * 位置為雙 calc，四角預設後從目前角落累加微調。
 *
 * 有自訂圖時：
 * - shell（#dynamic_logo）pointer-events: none，空白區穿透到河道
 * - ContextMenuTrigger 改掛在 DynamicLogoHitZone（對齊可見 logo）
 * 無圖時：整顆 creature box 仍為 trigger（舊行為）。
 */
export const DynamicLogo = ({ isLoggingIn }: DynamicLogoProps) => {
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false);
  /** 用途：naturalWidth 尚未就緒時，滑桿仍可動；量到寬後再寫 size。 */
  const [pendingScalePercent, setPendingScalePercent] = useState<number | null>(null);
  const [naturalWidth, setNaturalWidth] = useState<number | null>(null);
  /** 用途：hit zone 推算顯示高度；與 naturalWidth 一併從圖片載入。 */
  const [naturalHeight, setNaturalHeight] = useState<number | null>(null);
  const pendingScaleRef = useRef<number | null>(null);

  const backgroundImage = useStyleProp(DYNAMIC_LOGO_SELECTOR, "backgroundImage");
  const backgroundSize = useStyleProp(DYNAMIC_LOGO_SELECTOR, "backgroundSize");
  const backgroundRepeat = useStyleProp(DYNAMIC_LOGO_SELECTOR, "backgroundRepeat");
  const backgroundPosition = useStyleProp(DYNAMIC_LOGO_SELECTOR, "backgroundPosition");
  const imgOpacity = useStyleProp(DYNAMIC_LOGO_IMG_SELECTOR, "opacity");

  const hasImage = hasCustomLogoImage(backgroundImage.value as CssValue);
  const imageUrl = extractBackgroundImageUrl(backgroundImage.value);

  // 用途：store 已有圖（含匯入）時補量／還原 natural size，才能反推 % 與 hit zone。
  useEffect(() => {
    if (!imageUrl) {
      setNaturalWidth(null);
      setNaturalHeight(null);
      return;
    }

    const cachedW = getCachedNaturalWidth(imageUrl);
    const cachedH = getCachedNaturalHeight(imageUrl);
    if (cachedW) {
      setNaturalWidth(cachedW);
      setNaturalHeight(cachedH ?? null);
      return;
    }

    let cancelled = false;
    void loadImageNaturalWidth(imageUrl).then((width) => {
      if (cancelled || width == null) return;
      setNaturalWidth(width);
      setNaturalHeight(getCachedNaturalHeight(imageUrl) ?? null);
      // 用途：僅在上傳後尚無 size（pending scale）時寫入；匯入既有 size 不覆寫。
      if (pendingScaleRef.current != null) {
        backgroundSize.set(
          scaleToBackgroundSizePx(width, pendingScaleRef.current),
        );
        pendingScaleRef.current = null;
        setPendingScalePercent(null);
      }
    });

    return () => {
      cancelled = true;
    };
    // 用途：只跟著圖片 URL 補量寬；backgroundSize.set 來自 hook 每次 render 新函式，不可當 dep。
    // eslint-disable-next-line react-hooks/exhaustive-deps -- URL-driven hydrate only
  }, [imageUrl]);

  const scalePercent =
    pendingScalePercent ??
    (naturalWidth != null
      ? backgroundSizePxToScale(backgroundSize.value, naturalWidth)
      : DYNAMIC_LOGO_DEFAULT_SCALE_PERCENT);

  const logoPosition = parseLogoPosition(
    backgroundPosition.value ?? DYNAMIC_LOGO_DEFAULT_POSITION,
  );

  const applyScalePercent = (raw: number) => {
    const next = clampScalePercent(raw);
    pendingScaleRef.current = next;
    setPendingScalePercent(next);

    if (naturalWidth != null && naturalWidth > 0) {
      backgroundSize.set(scaleToBackgroundSizePx(naturalWidth, next));
      pendingScaleRef.current = null;
      setPendingScalePercent(null);
    }
  };

  const applyOffsetX = (raw: number) => {
    const nextX = sanitizeOffset(raw, logoPosition.xOffsetPx);
    backgroundPosition.set(
      formatLogoPosition({ ...logoPosition, xOffsetPx: nextX }),
    );
  };

  const applyOffsetY = (raw: number) => {
    const nextY = sanitizeOffset(raw, logoPosition.yOffsetPx);
    backgroundPosition.set(
      formatLogoPosition({ ...logoPosition, yOffsetPx: nextY }),
    );
  };

  const applyNudge = (dx: number, dy: number) => {
    backgroundPosition.set(
      formatLogoPosition(nudgeLogoPosition(logoPosition, dx, dy)),
    );
  };

  const applyCornerPreset = (corner: LogoCorner) => {
    backgroundPosition.set(formatLogoPosition(logoCornerPreset(corner)));
  };

  const resetToInitial = () => {
    clearNaturalWidthCache();
    setNaturalWidth(null);
    setNaturalHeight(null);
    pendingScaleRef.current = null;
    setPendingScalePercent(null);

    backgroundImage.set(
      backgroundImage.initial ?? DYNAMIC_LOGO_STYLE_DEFAULTS.backgroundImage,
    );
    backgroundSize.set(
      backgroundSize.initial ?? DYNAMIC_LOGO_STYLE_DEFAULTS.backgroundSize,
    );
    backgroundRepeat.set(
      backgroundRepeat.initial ?? DYNAMIC_LOGO_STYLE_DEFAULTS.backgroundRepeat,
    );
    backgroundPosition.set(
      backgroundPosition.initial ?? DYNAMIC_LOGO_STYLE_DEFAULTS.backgroundPosition,
    );
    imgOpacity.set(imgOpacity.initial ?? DYNAMIC_LOGO_IMG_STYLE_DEFAULTS.opacity);
  };

  const onUploadedUrl = (url: string) => {
    const trimmed = url.trim();
    if (!trimmed) return;

    const cssUrl = toBackgroundImageCssValue(trimmed);
    const scale = DYNAMIC_LOGO_DEFAULT_SCALE_PERCENT;
    pendingScaleRef.current = scale;
    setPendingScalePercent(scale);

    const cachedW = getCachedNaturalWidth(trimmed);
    const cachedH = getCachedNaturalHeight(trimmed);
    setNaturalWidth(cachedW ?? null);
    setNaturalHeight(cachedH ?? null);

    backgroundImage.set(cssUrl);
    backgroundRepeat.set("no-repeat");
    backgroundPosition.set(DYNAMIC_LOGO_DEFAULT_POSITION);
    imgOpacity.set("0");

    // 用途：有快取寬就立刻寫 NNpx，熱區才有面積；勿先寫 auto（parse 不到 px → 0×0）。
    if (cachedW) {
      backgroundSize.set(scaleToBackgroundSizePx(cachedW, scale));
      pendingScaleRef.current = null;
      setPendingScalePercent(null);
    }

    void loadImageNaturalWidth(trimmed).then((width) => {
      if (width == null) return;
      const height = getCachedNaturalHeight(trimmed);
      setNaturalWidth(width);
      setNaturalHeight(height ?? null);
      const nextScale =
        pendingScaleRef.current ?? DYNAMIC_LOGO_DEFAULT_SCALE_PERCENT;
      backgroundSize.set(scaleToBackgroundSizePx(width, nextScale));
      pendingScaleRef.current = null;
      setPendingScalePercent(null);
    });
  };

  const menuContent = (
    <EditorMenuContent style={{ minWidth: 260 }}>
      <DynamicLogoMenu
        hasImage={hasImage}
        scalePercent={scalePercent}
        offsetX={logoPosition.xOffsetPx}
        offsetY={logoPosition.yOffsetPx}
        onOpenUploadDialog={() => setUploadDialogOpen(true)}
        onScalePercentChange={applyScalePercent}
        onOffsetXChange={applyOffsetX}
        onOffsetYChange={applyOffsetY}
        onNudge={applyNudge}
        onCornerPreset={applyCornerPreset}
        onReset={resetToInitial}
      />
    </EditorMenuContent>
  );

  const creatureImg = (
    <img
      id="creature"
      src="/creature1.png"
      alt="creature"
      style={{ width: "auto", height: "auto" }}
    />
  );

  return (
    <>
      <DynamicLogoStyles />

      <ImageUploader
        showTrigger={false}
        open={uploadDialogOpen}
        onOpenChange={setUploadDialogOpen}
        isLoggingIn={isLoggingIn}
        onUploadedUrl={onUploadedUrl}
        onResetBackground={resetToInitial}
      />

      {hasImage ? (
        // 用途：shell 不接事件；熱區對齊可見 logo，巢狀 ContextMenu 擋住河道選單。
        <div id="dynamic_logo">
          {creatureImg}
          <ContextMenu>
            <ContextMenuTrigger asChild>
              <DynamicLogoHitZone
                backgroundSize={backgroundSize.value}
                position={logoPosition}
                naturalWidth={naturalWidth}
                naturalHeight={naturalHeight}
              />
            </ContextMenuTrigger>
            {menuContent}
          </ContextMenu>
        </div>
      ) : (
        <ContextMenu>
          <ContextMenuTrigger asChild>
            <div id="dynamic_logo">{creatureImg}</div>
          </ContextMenuTrigger>
          {menuContent}
        </ContextMenu>
      )}
    </>
  );
};
