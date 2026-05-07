import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "EMS | Employee Management System",
  description: "Modern Employee Management System for Admins",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
