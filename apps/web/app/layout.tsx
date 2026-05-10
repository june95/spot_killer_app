import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Spot Killer",
  description: "지도 위에 장소와 기억을 기록하는 개인/소그룹용 지도 앱",
};

type RootLayoutProps = Readonly<{
  children: React.ReactNode;
}>;

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="ko">
      <body>{children}</body>
    </html>
  );
}
