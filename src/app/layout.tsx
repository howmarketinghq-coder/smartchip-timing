import type { Metadata } from "next";
import { Noto_Sans_KR, Oswald, Bebas_Neue } from "next/font/google";
import { ToastProvider } from "@/components/ui/Toast";
import "./globals.css";

const notoSansKR = Noto_Sans_KR({
  variable: "--font-noto-sans-kr",
  subsets: ["latin"],
  weight: ["300", "400", "500", "700", "900"],
  display: "swap",
});

const oswald = Oswald({
  variable: "--font-oswald",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

const bebasNeue = Bebas_Neue({
  variable: "--font-bebas-neue",
  subsets: ["latin"],
  weight: ["400"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "SMART CHIP - No.1 Timing System",
  description: "마라톤 타이밍 기록 조회 시스템",
  keywords: ["마라톤", "타이밍", "기록조회", "스마트칩", "SMART CHIP"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body
        className={`${notoSansKR.variable} ${oswald.variable} ${bebasNeue.variable} font-[family-name:var(--font-noto-sans-kr)] antialiased`}
      >
        <ToastProvider>{children}</ToastProvider>
      </body>
    </html>
  );
}
