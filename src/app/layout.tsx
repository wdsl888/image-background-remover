import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "AI 抠图工具 - 一键去除图片背景",
  description: "AI智能抠图工具，一键去除图片背景，支持人物、商品、动物等图片处理",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
