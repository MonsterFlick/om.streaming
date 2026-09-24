import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "uncompiled.om // Studio Suite & Virtual Stream Deck",
  description: "Tactile Industrial Minimalist OBS Overlay Suite & Stream Deck Hub",
  icons: {
    icon: "/favicon.ico",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: "#08090c",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased bg-transparent text-[#f4f5f8] min-h-screen">
        {children}
      </body>
    </html>
  );
}
