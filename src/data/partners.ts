/**
 * Brand partners. Logos live in public/partners/.
 * Each tile links to the channel search for that brand so visitors can
 * find the actual collab videos — no invented claims.
 */
export type Partner = {
  name: string;
  logo: string;
  query: string;
};

export const PARTNERS: Partner[] = [
  { name: "Samsung", logo: "/partners/samsung.svg", query: "Samsung" },
  { name: "Rapido", logo: "/partners/rapido.svg", query: "Rapido" },
  { name: "Uber", logo: "/partners/uber.svg", query: "Uber" },
  { name: "Zoho", logo: "/partners/zoho.svg", query: "Zoho" },
  { name: "realme", logo: "/partners/realme.svg", query: "realme" },
  { name: "Xiaomi", logo: "/partners/xiaomi.svg", query: "Xiaomi" },
  { name: "OPPO", logo: "/partners/oppo.svg", query: "Oppo" },
  { name: "Mamaearth", logo: "/partners/mamaearth.png", query: "Mamaearth" },
  { name: "boAt", logo: "/partners/boat.svg", query: "boAt" },
  { name: "Noise", logo: "/partners/noise.png", query: "Noise" },
  { name: "Flipkart", logo: "/partners/flipkart.png", query: "Flipkart" },
  { name: "Amazon", logo: "/partners/amazon.png", query: "Amazon" },
  { name: "Myntra", logo: "/partners/myntra.png", query: "Myntra" },
  { name: "Meesho", logo: "/partners/meesho.png", query: "Meesho" },
  { name: "vivo", logo: "/partners/vivo.svg", query: "vivo" },
];

export function partnerSearchUrl(handle: string, query: string): string {
  return `https://www.youtube.com/${handle}/search?query=${encodeURIComponent(query)}`;
}
