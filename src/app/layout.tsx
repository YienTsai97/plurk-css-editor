import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "./providers";

export const metadata: Metadata = {
  title: "Plurk Styler",
  description: "在真實樣貌的預覽上右鍵改樣式，匯出 CSS，貼回噗浪就生效。",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        id="pcg"
        className={`antialiased html5 language-large-font timeline`}
      >
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
