import type { Metadata } from "next";
import { DM_Sans, Source_Serif_4 } from "next/font/google";
import "./globals.css";

const sans = DM_Sans({
  subsets: ["latin"],
  variable: "--app-font-sans",
});

const serif = Source_Serif_4({
  subsets: ["latin"],
  variable: "--app-font-serif",
});

export const metadata: Metadata = {
  title: "IELTS Academic Writing 練習",
  description: "IELTS Academic Writing Task 1・Task 2 の時間制限つき練習",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body className={`${sans.variable} ${serif.variable} font-sans antialiased`}>
        {children}
      </body>
    </html>
  );
}
