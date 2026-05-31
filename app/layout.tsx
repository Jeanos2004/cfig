import type { Metadata } from "next";
import { Playfair_Display, DM_Sans, Space_Grotesk } from "next/font/google";
import "./globals.css";

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  display: "swap",
});

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-dm-sans",
  display: "swap",
});

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space",
  display: "swap",
});

export const metadata: Metadata = {
  title: "CFIG Guinée — Cabinet de Formation Informatique de Gestion",
  description:
    "Cabinet de référence en formation professionnelle à Conakry. Informatique, gestion, logistique, communication, analyse de données.",
};

/**
 * Root layout minimal — délègue tout aux layouts enfants.
 * Fournit uniquement le HTML shell, les polices et le CSS global.
 */
export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="fr"
      className={`${playfair.variable} ${dmSans.variable} ${spaceGrotesk.variable}`}
    >
      <body>{children}</body>
    </html>
  );
}
