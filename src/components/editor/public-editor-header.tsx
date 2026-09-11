// "use client"

// import { useCSSImporter } from "@/store/styleManager/styleManager";
// import Image from "next/image";
// import { useEffect, useState } from "react";

// export const PublicEditorHeader = () => {
//   const { getAllStyles } = useCSSImporter();
//   const [styleCount, setStyleCount] = useState(0);
//   const [lastSaved, setLastSaved] = useState<Date | null>(null);

//   // 更新樣式計數
//   useEffect(() => {
//     const updateStyleCount = () => {
//       try {
//         const { css } = getAllStyles();
//         const ruleCount = (css.match(/\}/g) || []).length;
//         setStyleCount(ruleCount);
//       } catch (error) {
//         console.error('Error counting styles:', error);
//       }
//     };

//     updateStyleCount();

//     // 每 5 秒更新一次計數
//     const interval = setInterval(updateStyleCount, 5000);

//     return () => clearInterval(interval);
//   }, [getAllStyles]);

//   // 檢查 localStorage 草稿
//   useEffect(() => {
//     const checkDraft = () => {
//       try {
//         const savedDraft = localStorage.getItem('plurk-css-editor-draft');
//         if (savedDraft) {
//           const { timestamp } = JSON.parse(savedDraft);
//           setLastSaved(new Date(timestamp));
//         }
//       } catch (error) {
//         console.error('Error checking draft:', error);
//       }
//     };

//     checkDraft();

//     // 每 10 秒檢查一次草稿狀態
//     const interval = setInterval(checkDraft, 10000);

//     return () => clearInterval(interval);
//   }, []);

//   return (
//     <div
//       style={{
//         position: "fixed",
//         top: 0,
//         left: 0,
//         right: 0,
//         backgroundColor: "#FF574D",
//         color: "#fff",
//         padding: "0 12px",
//         height: "42px",
//         zIndex: 1000,
//         display: "flex",
//         justifyContent: "space-between",
//         alignItems: "center",
//         boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
//       }}
//     >
//       <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
//         <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
//           <Image src="/testicon/star.svg" alt="star" width={20} height={20} />
//           <Image src="/testicon/star.svg" alt="star" width={20} height={20} />
//           <Image src="/plurk-icon.svg" alt="plurk logo" width={28} height={24} />
//         </div>
//         <h1
//           style={{
//             margin: 0,
//             fontSize: "14px",
//             fontWeight: 600,
//             color: "#fff",
//             lineHeight: "1",
//           }}
//         >
//           Plurk Styler
//         </h1>
//         <div style={{ display: "flex", gap: "12px", fontSize: "12px" }}>
//           <span>
//             📝 樣式規則: <strong>{styleCount}</strong>
//           </span>
//           {lastSaved && (
//             <span>
//               💾 上次儲存: <strong>{lastSaved.toLocaleTimeString()}</strong>
//             </span>
//           )}
//         </div>
//       </div>

//       <div style={{ display: "flex", gap: "12px", fontSize: "12px" }}>
//         <span style={{ opacity: 0.85 }}>🚀 公開編輯器 - 免登入即可使用</span>
//         <span style={{ opacity: 0.75 }}>💡 提示: 使用右側按鈕匯入/匯出 CSS</span>
//       </div>
//     </div>
//   );
// };
