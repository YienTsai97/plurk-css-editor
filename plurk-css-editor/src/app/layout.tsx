import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "./providers";

export const metadata: Metadata = {
  title: "Plurk CSS Editor",
  description: "Generated custom CSS for Plurk",
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
