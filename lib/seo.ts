export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://kasa-three-xi.vercel.app"
).replace(/\/+$/, "");

export function serializeJsonLd(value: Record<string, unknown>): string {
  return JSON.stringify(value).replace(/</g, "\\u003c");
}
