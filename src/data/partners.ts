/**
 * Brand partners. Logos live in public/partners/.
 * When `videoUrl` is set, the logo links directly to that sponsored/collab
 * video; otherwise it falls back to a channel-scoped search so visitors can
 * find the relevant uploads — no invented claims.
 */
export type Partner = {
  name: string;
  logo: string;
  query: string;
  videoUrl?: string;
};

export const PARTNERS: Partner[] = [
  { name: "Samsung", logo: "/partners/samsung.svg", query: "Samsung", videoUrl: "https://www.youtube.com/watch?v=QkoPeiGrtb8" },
  { name: "Rapido", logo: "/partners/rapido.svg", query: "Rapido", videoUrl: "https://www.youtube.com/watch?v=wDI8iKLKvNM" },
  { name: "Uber", logo: "/partners/uber.svg", query: "Uber" },
  { name: "Zoho", logo: "/partners/zoho.svg", query: "Zoho" },
  { name: "realme", logo: "/partners/realme.svg", query: "realme", videoUrl: "https://www.youtube.com/watch?v=JqMnI0TKSi8" },
  { name: "Xiaomi", logo: "/partners/xiaomi.svg", query: "Xiaomi", videoUrl: "https://www.youtube.com/watch?v=TqkhQi9Vly4" },
  { name: "OPPO", logo: "/partners/oppo.svg", query: "Oppo", videoUrl: "https://www.youtube.com/watch?v=UwEBfY5yx54" },
  { name: "Mamaearth", logo: "/partners/mamaearth.png", query: "Mamaearth" },
  { name: "boAt", logo: "/partners/boat.svg", query: "boAt", videoUrl: "https://www.youtube.com/watch?v=9MrhMTVFNN4" },
  { name: "Noise", logo: "/partners/noise.png", query: "Noise" },
  { name: "Flipkart", logo: "/partners/flipkart.png", query: "Flipkart", videoUrl: "https://www.youtube.com/watch?v=BwFZyecMZL4" },
  { name: "Amazon", logo: "/partners/amazon.png", query: "Amazon", videoUrl: "https://www.youtube.com/watch?v=ASMmBa7xybw" },
  { name: "Myntra", logo: "/partners/myntra.png", query: "Myntra" },
  { name: "Groww", logo: "/partners/groww.svg", query: "Groww" },
  { name: "vivo", logo: "/partners/vivo.svg", query: "vivo" },
];

export function partnerUrl(handle: string, p: Partner): string {
  if (p.videoUrl) return p.videoUrl;
  return `https://www.youtube.com/${handle}/search?query=${encodeURIComponent(p.query)}`;
}