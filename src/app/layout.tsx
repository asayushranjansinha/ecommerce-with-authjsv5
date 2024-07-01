import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { SessionProvider } from "next-auth/react";
import { auth } from "@/auth";
import { Toaster } from "sonner";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "BharatBazaar - Your Online Indian Marketplace",
  description:
    "Discover a wide range of products with an authentic Indian touch. Shop for traditional clothing, spices, handicrafts, and more at BharatBazaar.",
  keywords: [
    "BharatBazaar",
    "Indian marketplace",
    "online shopping",
    "traditional Indian products",
    "Indian clothing",
    "Indian spices",
    "handicrafts",
    "React.js",
    "Next.js",
    "Ayush Ranjan Sinha",
  ],
  authors: [{ name: "Ayush Ranjan Sinha" }],
  creator: "Ayush Ranjan Sinha",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth();
  return (
    <SessionProvider session={session}>
      <html lang="en">
        <body className={`${inter.className}`}>
          <div className="h-full w-full bg-radial-gradient-custom from-sky-400 to-blue-800">
            {children}
            <Toaster />
          </div>
        </body>
      </html>
    </SessionProvider>
  );
}
