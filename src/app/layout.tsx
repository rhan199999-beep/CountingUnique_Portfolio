import type { Metadata } from "next";
import { Bricolage_Grotesque } from "next/font/google";
import SmoothScroll from "@/components/SmoothScroll";
import Nav from "@/components/Nav";
import "./globals.css";

const display = Bricolage_Grotesque({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-display",
  display: "swap",
});

export const viewport = {
  themeColor: "#ffffff",
};

export const metadata: Metadata = {
  title: "Counting Unique · Pranay Gupta — YouTube portfolio",
  description:
    "Pranay Gupta runs Counting Unique and Saypranay on YouTube: live subscriber counts, latest uploads refreshed hourly, studio analytics, and brand collabs.",
  openGraph: {
    title: "Counting Unique · Pranay Gupta",
    description:
      "Two YouTube channels, live sub counts, latest uploads refreshed hourly, and brand collabs.",
    type: "website",
    images: [{ url: "/logo.png", width: 1646, height: 804, alt: "Counting Unique" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Counting Unique · Pranay Gupta",
    description:
      "Two YouTube channels, live sub counts, latest uploads refreshed hourly, and brand collabs.",
    images: ["/logo.png"],
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={display.variable}>
      <body className="bg-paper font-body text-ink antialiased">
        <SmoothScroll>
          <Nav />
          {children}
        </SmoothScroll>
      </body>
    </html>
  );
}
