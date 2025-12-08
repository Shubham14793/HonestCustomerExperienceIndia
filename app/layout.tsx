import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Honest Customer Experience India",
  description: "Share your genuine customer experience stories and help others make informed decisions",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  );
}
