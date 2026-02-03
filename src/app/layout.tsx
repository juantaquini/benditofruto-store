import type { Metadata } from "next";
import Header from "@/components/layout/Header";
import "./globals.css";
import Footer from "@/components/layout/Footer";
import { CartProvider } from "@/context/CartContext";

import { Crimson_Pro } from "next/font/google";

const crimson = Crimson_Pro({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-crimson",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Bendito Fruto",
    template: "%s · Bendito Fruto",
  },
  description:
    "Original watercolor artworks inspired by landscapes and travel. Contemporary artist-created art.",
  icons: {
    icon: "/images/taco-p5/TACO_005.png",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es" className={crimson.variable}>
      <body className="min-h-screen flex flex-col bg-white font-crimson antialiased">
        <CartProvider>
          <Header />
          <main className="flex-1"> {children}</main>
        </CartProvider>
        <Footer />
      </body>
    </html>
  );
}
