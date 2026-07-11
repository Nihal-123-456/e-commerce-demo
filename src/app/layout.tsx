import type { Metadata } from "next";
import "./globals.css";
import Provider from "@/provider";
import StoreProvider from "@/redux/StoreProvider";
import InitUser from "@/initUser";

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
        <Provider>
          <StoreProvider>
            <InitUser/>
            {children}
          </StoreProvider>
        </Provider>
        </body>
    </html>
  );
}
