import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Peel. | Pick 8 Custom Sticker Sheets",
  description:
    "Build a custom eight-sticker sheet with an accessible, playful sticker picker.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
