import { cssValueToString } from "@/store/styleManager/utils/cssValue";
import type { CssValue } from "@/types/css.type";
import {
  DYNAMIC_LOGO_DEFAULT_OFFSET_X,
  DYNAMIC_LOGO_DEFAULT_OFFSET_Y,
  DYNAMIC_LOGO_DEFAULT_POSITION,
  DYNAMIC_LOGO_DEFAULT_SCALE_PERCENT,
  DYNAMIC_LOGO_EXPORT_IMG_SELECTOR,
  DYNAMIC_LOGO_EXPORT_Z_INDEX,
  DYNAMIC_LOGO_SCALE_MAX,
  DYNAMIC_LOGO_SCALE_MIN,
  DYNAMIC_LOGO_SELECTOR,
  type LogoCorner,
} from "./dynamic-logo.constants";

/** 用途：依圖片 URL 快取 naturalWidth／naturalHeight（%↔px 與 hit zone 高度）。 */
type NaturalSize = { width: number; height: number };
const naturalSizeByUrl = new Map<string, NaturalSize>();

/** 用途：background-position 的雙 calc 內部模型。 */
export type LogoPosition = {
  xBase: 0 | 100;
  xOffsetPx: number;
  yBase: 0 | 100;
  yOffsetPx: number;
};

type ExportStyleEntry = {
  value: CssValue;
  source: "registered" | "imported" | "manual";
};

const DEFAULT_LOGO_POSITION: LogoPosition = {
  xBase: 100,
  xOffsetPx: DYNAMIC_LOGO_DEFAULT_OFFSET_X,
  yBase: 0,
  yOffsetPx: DYNAMIC_LOGO_DEFAULT_OFFSET_Y,
};

const CORNER_PRESETS: Record<LogoCorner, LogoPosition> = {
  "top-right": { xBase: 100, xOffsetPx: 0, yBase: 0, yOffsetPx: 0 },
  "top-left": { xBase: 0, xOffsetPx: 0, yBase: 0, yOffsetPx: 0 },
  "bottom-right": { xBase: 100, xOffsetPx: 0, yBase: 100, yOffsetPx: 0 },
  "bottom-left": { xBase: 0, xOffsetPx: 0, yBase: 100, yOffsetPx: 0 },
};

/** 用途：判斷噗寶是否已有可顯示的自訂背景圖（非空、非 none）。 */
export function hasCustomLogoImage(value: CssValue | undefined): boolean {
  const text = cssValueToString(value).trim();
  return text !== "" && text !== "none";
}

/** 用途：把原圖倍率 % clamp 到允許範圍。 */
export function clampScalePercent(value: number): number {
  if (!Number.isFinite(value)) return DYNAMIC_LOGO_DEFAULT_SCALE_PERCENT;
  return Math.min(DYNAMIC_LOGO_SCALE_MAX, Math.max(DYNAMIC_LOGO_SCALE_MIN, value));
}

/** 用途：僅接受 finite number；非法則回傳 fallback。 */
export function sanitizeOffset(value: number, fallback: number): number {
  return Number.isFinite(value) ? value : fallback;
}

/** 用途：naturalWidth + scale% → `NNpx`（寫入 background-size）。 */
export function scaleToBackgroundSizePx(naturalWidth: number, scalePercent: number): string {
  const px = Math.round(naturalWidth * (clampScalePercent(scalePercent) / 100));
  return `${px}px`;
}

/** 用途：從 `NNpx` + naturalWidth 反推 UI 顯示的原圖倍率 %。 */
export function backgroundSizePxToScale(
  backgroundSize: unknown,
  naturalWidth: number,
): number {
  if (!(naturalWidth > 0)) return DYNAMIC_LOGO_DEFAULT_SCALE_PERCENT;
  const text = cssValueToString(backgroundSize).trim();
  const match = text.match(/^(\d+(?:\.\d+)?)/);
  const sizePx = Number(match?.[1]);
  if (!Number.isFinite(sizePx)) return DYNAMIC_LOGO_DEFAULT_SCALE_PERCENT;
  return clampScalePercent((sizePx / naturalWidth) * 100);
}

/** 用途：單一軸 → `calc(100%)` / `calc(100% - Npx)` / `calc(0% + Npx)`。 */
export function formatLogoPositionAxis(base: 0 | 100, offsetPx: number): string {
  const offset = sanitizeOffset(offsetPx, 0);
  if (offset === 0) return `calc(${base}%)`;
  if (base === 100) return `calc(100% - ${offset}px)`;
  return `calc(0% + ${offset}px)`;
}

/** 用途：LogoPosition → `calc(...) calc(...)`。 */
export function formatLogoPosition(position: LogoPosition): string {
  const x = sanitizeOffset(position.xOffsetPx, DYNAMIC_LOGO_DEFAULT_OFFSET_X);
  const y = sanitizeOffset(position.yOffsetPx, DYNAMIC_LOGO_DEFAULT_OFFSET_Y);
  return `${formatLogoPositionAxis(position.xBase, x)} ${formatLogoPositionAxis(position.yBase, y)}`;
}

/** 用途：解析單一 calc 軸；不符時回傳 null。 */
function parseLogoPositionAxis(
  token: string,
): { base: 0 | 100; offsetPx: number } | null {
  const text = token.trim();
  const bare = text.match(/^calc\(\s*(0|100)\s*%\s*\)$/i);
  if (bare) {
    return { base: Number(bare[1]) as 0 | 100, offsetPx: 0 };
  }

  const fromRight = text.match(
    /^calc\(\s*100\s*%\s*-\s*(-?\d+(?:\.\d+)?)\s*px\s*\)$/i,
  );
  if (fromRight) {
    return { base: 100, offsetPx: Number(fromRight[1]) };
  }

  const fromLeft = text.match(
    /^calc\(\s*0\s*%\s*\+\s*(-?\d+(?:\.\d+)?)\s*px\s*\)$/i,
  );
  if (fromLeft) {
    return { base: 0, offsetPx: Number(fromLeft[1]) };
  }

  return null;
}

/**
 * 用途：解析 `calc(...) calc(...)`；亦相容舊 `right Npx top Mpx`。
 * 格式不符時回退右上預設。
 */
export function parseLogoPosition(value: unknown): LogoPosition {
  const text = cssValueToString(value).trim();
  if (!text) return { ...DEFAULT_LOGO_POSITION };

  const calcMatch = text.match(/^(calc\([^)]*\))\s+(calc\([^)]*\))$/i);
  if (calcMatch) {
    const x = parseLogoPositionAxis(calcMatch[1]);
    const y = parseLogoPositionAxis(calcMatch[2]);
    if (x && y) {
      return {
        xBase: x.base,
        xOffsetPx: x.offsetPx,
        yBase: y.base,
        yOffsetPx: y.offsetPx,
      };
    }
  }

  const legacy = text.match(
    /^right\s+(-?\d+(?:\.\d+)?)px\s+top\s+(-?\d+(?:\.\d+)?)px$/i,
  );
  if (legacy) {
    return {
      xBase: 100,
      xOffsetPx: Number(legacy[1]),
      yBase: 0,
      yOffsetPx: Number(legacy[2]),
    };
  }

  return { ...DEFAULT_LOGO_POSITION };
}

/** 用途：四角預設（offsets 歸零）。 */
export function logoCornerPreset(corner: LogoCorner): LogoPosition {
  return { ...CORNER_PRESETS[corner] };
}

/**
 * 用途：依螢幕方向微調（dx>0 右移、dy>0 下移），從目前角落 calc 累加。
 */
export function nudgeLogoPosition(
  position: LogoPosition,
  dx: number,
  dy: number,
): LogoPosition {
  const xDelta = sanitizeOffset(dx, 0);
  const yDelta = sanitizeOffset(dy, 0);
  return {
    xBase: position.xBase,
    yBase: position.yBase,
    xOffsetPx: sanitizeOffset(
      position.xBase === 100
        ? position.xOffsetPx - xDelta
        : position.xOffsetPx + xDelta,
      position.xOffsetPx,
    ),
    yOffsetPx: sanitizeOffset(
      position.yBase === 100
        ? position.yOffsetPx - yDelta
        : position.yOffsetPx + yDelta,
      position.yOffsetPx,
    ),
  };
}

/** 用途：從 `url("...")` / `url('...')` / `url(...)` 抽出網址。 */
export function extractBackgroundImageUrl(value: unknown): string | null {
  const text = cssValueToString(value).trim();
  const match = text.match(/^url\(\s*(['"]?)(.*?)\1\s*\)$/i);
  if (!match) return null;
  const href = match[2]?.trim();
  return href ? href : null;
}

/** 用途：匯出用單引號 url('...')。 */
function toExportBackgroundUrl(imageValue: string): string {
  const href = extractBackgroundImageUrl(imageValue);
  if (!href) return imageValue.trim();
  return `url('${href.replace(/'/g, "\\'")}')`;
}

/**
 * 用途：有自訂圖時輸出嚴格匯出區塊（中文註解 + `#dynamic_logo>img` + background shorthand）。
 * 無 backgroundImage（或 none）時回傳 null，交給一般 formatCssBlock。
 */
export function formatDynamicLogoExportBlock(
  logoProps: Map<string, ExportStyleEntry>,
  _imgProps?: Map<string, ExportStyleEntry>,
): string | null {
  // 用途：第二參數保留給呼叫端標示 img selector 已處理；opacity 固定寫 0，此處不讀 map。
  void _imgProps;
  const imageEntry = logoProps.get("backgroundImage");
  const imageValue = imageEntry?.value;
  if (!imageValue || !hasCustomLogoImage(imageValue)) return null;

  const size =
    cssValueToString(logoProps.get("backgroundSize")?.value).trim() || "auto";
  const repeat =
    cssValueToString(logoProps.get("backgroundRepeat")?.value).trim() ||
    "no-repeat";
  const position =
    cssValueToString(logoProps.get("backgroundPosition")?.value).trim() ||
    DYNAMIC_LOGO_DEFAULT_POSITION;
  const url = toExportBackgroundUrl(cssValueToString(imageValue));

  const imgBlock = `/*隱藏官方噗寶，圖片不透明度(opacity)為0*/\n${DYNAMIC_LOGO_EXPORT_IMG_SELECTOR} {opacity: 0;}`;
  const logoBlock = [
    `/*自定義噗寶*/`,
    `${DYNAMIC_LOGO_SELECTOR}{`,
    ` background: ${url} ${repeat};`,
    ` background-size: ${size};`,
    ` background-position: ${position};`,
    ` z-index: ${DYNAMIC_LOGO_EXPORT_Z_INDEX};`,
    ` width: 100%;`,
    ` height: 100%;`,
    ` -webkit-transition: none;-moz-transition: none;-o-transition: none;transition: none;`,
    `}`,
  ].join("\n");

  return `${imgBlock}\n\n${logoBlock}`;
}

/** 用途：讀取快取的 naturalWidth（若有）。 */
export function getCachedNaturalWidth(url: string): number | undefined {
  const size = naturalSizeByUrl.get(url);
  return size && size.width > 0 ? size.width : undefined;
}

/** 用途：讀取快取的 naturalHeight（若有；hit zone 推算顯示高度用）。 */
export function getCachedNaturalHeight(url: string): number | undefined {
  const size = naturalSizeByUrl.get(url);
  return size && size.height > 0 ? size.height : undefined;
}

/** 用途：寫入 natural size 快取（寬高皆須 > 0）。 */
export function setCachedNaturalWidth(
  url: string,
  width: number,
  height?: number,
): void {
  if (!url || !(width > 0)) return;
  const nextHeight = height && height > 0 ? height : naturalSizeByUrl.get(url)?.height;
  if (nextHeight && nextHeight > 0) {
    naturalSizeByUrl.set(url, { width, height: nextHeight });
  }
}

/** 用途：重置時清掉全部 URL → natural size 快取。 */
export function clearNaturalWidthCache(): void {
  naturalSizeByUrl.clear();
}

/**
 * 用途：以 `new Image()` 載入並量 naturalWidth／Height；成功則寫入快取。
 * 失敗回傳 null（呼叫端可不寫 size）。
 */
export function loadImageNaturalWidth(url: string): Promise<number | null> {
  const trimmed = url.trim();
  if (!trimmed) return Promise.resolve(null);

  const cached = naturalSizeByUrl.get(trimmed);
  if (cached && cached.width > 0) return Promise.resolve(cached.width);

  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => {
      const width = img.naturalWidth;
      const height = img.naturalHeight;
      if (width > 0 && height > 0) {
        naturalSizeByUrl.set(trimmed, { width, height });
        resolve(width);
        return;
      }
      console.warn(
        "[dynamic-logo] image loaded but natural size invalid:",
        trimmed,
        { width, height },
      );
      resolve(null);
    };
    img.onerror = () => {
      console.warn("[dynamic-logo] failed to load image for naturalWidth:", trimmed);
      resolve(null);
    };
    img.src = trimmed;
  });
}
