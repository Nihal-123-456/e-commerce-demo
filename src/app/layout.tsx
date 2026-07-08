import type { Metadata } from "next";
import "./globals.css";
import Provider from "@/provider";

export const metadata: Metadata = {
  title: "Grocery Cart",
  description: "Get Groceries delivered to your home",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
    >
      <body className="min-h-screen w-full bg-linear-to-b from-blue-100 to-white">
        <Provider>{children}</Provider>
        </body>
    </html>
  );
}
