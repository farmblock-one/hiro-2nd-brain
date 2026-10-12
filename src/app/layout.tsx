import type { Metadata, Viewport } from "next";
import "./globals.css";

const basePath = process.env.NEXT_PUBLIC_BASE_PATH || "";

export const metadata: Metadata = {
  title: "Cat.Me",
  description: "Second brain của Hiro, canh giữ bởi một chú mèo Tuxedo.",
  manifest: `${basePath}/manifest.webmanifest`,
  icons: { icon: `${basePath}/icons/icon.svg`, apple: `${basePath}/icons/icon-192.png` },
  appleWebApp: { capable: true, title: "Cat.Me", statusBarStyle: "black-translucent" },
};

export const viewport: Viewport = {
  themeColor: "#121317",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="vi">
      <body className="min-h-dvh antialiased">{children}</body>
    </html>
  );
}
