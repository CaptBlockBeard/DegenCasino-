import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Degen Casino Blink - Captain Blockbeard's Treasure Hunt",
  description: "Set sail and test yer luck in this swashbucklin Solana token swap adventure! Spin the wheel and see if fortune favors yer quest for treasure, matey! Arrr!",
  openGraph: {
    title: "Degen Casino Blink - Captain Blockbeard's Treasure Hunt",
    description: "Set sail and test yer luck in this swashbucklin Solana token swap adventure! Spin the wheel and see if fortune favors yer quest for treasure, matey! Arrr!",
    images: [
      {
        url: "https://degencasinoblink.captainblockbeard.site/og-image.jpg",
      },
    ],
    url: "https://degencasinoblink.captainblockbeard.site",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  );
}
