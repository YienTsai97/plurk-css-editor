"use client";

import {
  IconAbout,
  IconDashboard,
  IconPlurkCssGeneratorLogo,
} from "@/components/preview/common/preview-icons";
import { useCSSImporter } from "@/store/styleManager/styleManager";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

export const PlurkTopBar = () => {
  const { getAllStyles } = useCSSImporter();
  const [, setStyleCount] = useState(0);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);

  useEffect(() => {
    const updateStyleCount = () => {
      try {
        const { css } = getAllStyles();
        const ruleCount = (css.match(/\}/g) || []).length;
        setStyleCount(ruleCount);
      } catch (error) {
        console.error("Error counting styles:", error);
      }
    };

    updateStyleCount();
    const interval = setInterval(updateStyleCount, 5000);
    return () => clearInterval(interval);
  }, [getAllStyles]);

  useEffect(() => {
    const checkDraft = () => {
      try {
        const savedDraft = localStorage.getItem("plurk-css-editor-draft");
        if (savedDraft) {
          const { timestamp } = JSON.parse(savedDraft);
          setLastSaved(new Date(timestamp));
        }
      } catch (error) {
        console.error("Error checking draft:", error);
      }
    };

    checkDraft();
    const interval = setInterval(checkDraft, 10000);
    return () => clearInterval(interval);
  }, []);

  return (
    <>
      <style>
        {`
        #top_bar * {
          vertical-align: middle;
          text-align: center;
          color: #FFF;
        }
        #top_bar {
          display: flex;
          flex-direction: row;
          justify-content: space-between;
          padding: 0 12px;
          position: sticky;
          z-index: 1000;
          overflow: visible;
          pointer-events: auto;
        }
        .bar-color {
          position: absolute;
          background: #FF574D;
          opacity: 0.9 !important;
          z-index: 0;
          pointer-events: none;
        }
        #top_bar, .bar-color {
          width: 100%;
          height: 42px;
          top: 0;
          left: 0;
        }
        #top-bar-main, #top-bar-title, #top-bar-user {
          height: 42px;
          display: flex;
          align-items: center;
          position: relative;
          z-index: 1;
        }
        .item-container, #navbar-account #nav-account {
          display: flex;
          align-items: center;
          gap: 9px;
          list-style: none;
          margin: 0;
          padding: 0;
        }
        #top-bar-editor-info {
          display: flex;
          align-items: center;
          gap: 12px;
          font-size: 12px;
          color: #fff;
        }
        #top-bar-editor-info strong {
          font-weight: 600;
        }
        .top-bar-icon-btn {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 32px;
          height: 32px;
          border: none;
          background: transparent;
          color: #fff;
          cursor: pointer;
          border-radius: 6px;
          padding: 0;
          text-decoration: none;
          position: relative;
        }
        .top-bar-icon-btn svg {
          pointer-events: none;
        }
        #top_bar .top-bar-icon-btn:hover:not(:disabled) {
          background: rgba(255, 255, 255, 0.22);
          color: #fff;
        }
        .top-bar-icon-btn:disabled {
          cursor: default;
          opacity: 0.95;
        }
        .top-bar-icon-btn[title]:hover::after {
          content: attr(title);
          position: absolute;
          top: calc(100% + 6px);
          left: 50%;
          transform: translateX(-50%);
          background: #333;
          color: #fff;
          font-size: 12px;
          line-height: 1.3;
          white-space: nowrap;
          padding: 4px 8px;
          border-radius: 4px;
          z-index: 2;
          pointer-events: none;
        }
        #plurk_logo {
          color: #fff;
        }
        #plurk_logo a {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          text-decoration: none;
        }
        #nav-account img {
          width: 20px;
          height: 20px;
          border-radius: 2px;
        }
        `}
      </style>
      <div id="top_bar">
        <div className="bar-color" />
        <div id="top-bar-main">
          <ul className="item-container">
            <li id="navbar-dashboard" className="item tab portal">
              <button
                type="button"
                className="top-bar-icon-btn"
                title="功能建置中，未開放"
                disabled
                aria-label="Dashboard（建置中）"
              >
                <IconDashboard size={20} />
              </button>
            </li>
            <li id="navbar-about" className="item tab portal">
              <Link
                href="/about"
                className="top-bar-icon-btn"
                title="關於我與版權聲明"
                aria-label="關於我與版權聲明"
              >
                <IconAbout size={20} />
              </Link>
            </li>
          </ul>
        </div>
        <div id="top-bar-title">
          <div id="plurk_logo" className="nohover">
            <Link href="/editor" aria-label="Plurk Styler">
              <IconPlurkCssGeneratorLogo size={28} aria-hidden={false} />
            </Link>
          </div>
        </div>
        <div id="top-bar-user">
          <ul className="item-container">
            <li id="navbar-editor-info" className="item hideMobile">
              <div id="top-bar-editor-info">
                {lastSaved && (
                  <span>
                    上次儲存: <strong>{lastSaved.toLocaleTimeString()}</strong>
                  </span>
                )}
              </div>
            </li>
            <li id="navbar-account" className="item">
              <div id="nav-account">
                <Image
                  src="/profile_icon.png"
                  alt="user avatar"
                  width={20}
                  height={20}
                  unoptimized
                />
                <span>myAccount</span>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </>
  );
};
