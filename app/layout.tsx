import type { Metadata } from "next";
import { IBM_Plex_Mono, Poppins } from "next/font/google";

import "./globals.css";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-poppins"
});

const ibmPlexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-ibm-plex-mono"
});

export const metadata: Metadata = {
  title: "TRADEWISE",
  description: "Astro-powered market intelligence dashboard for Indian trading analysis."
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${poppins.variable} ${ibmPlexMono.variable} bg-navy font-sans text-slate-900 antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
