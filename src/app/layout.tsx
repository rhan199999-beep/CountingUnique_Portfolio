import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import SmoothScroll from "@/components/SmoothScroll";
import Nav from "@/components/Nav";
import "./globals.css";

// Poppins mirrors the wordmark in /public/logo.png: geometric, circular
// bowls and a smooth, rounded silhouette. Using one family for display and
// body keeps every line on the page reading as the same voice.
const display = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-display",
  display: "swap",
});

export const viewport = {
  themeColor: "#eaf3fc",
};

export const metadata: Metadata = {
  metadataBase: new URL("https://counting-unique-portfolio.vercel.app"),
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
