import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Web3Provider } from "@/providers/Web3Provider";
import NetworkGuard from "@/components/Wallet/NetworkGuard";
import "./globals.css";

export const metadata: Metadata = {
  title: "OgaRent | Secure Property Escrow",
  description: "A Web2.5 milestone-driven rental escrow protocol built on EVM.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="bg-surface text-on-surface font-body-md antialiased overflow-x-hidden">
        <Web3Provider>
          <Navbar />
          <NetworkGuard />
          {children}
          <Footer />
        </Web3Provider>
      </body>
    </html>
  );
}
