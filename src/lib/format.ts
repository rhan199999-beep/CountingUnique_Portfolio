export function formatDate(published: string): string {
  if (!published) return "YouTube";
  return new Date(published).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}
