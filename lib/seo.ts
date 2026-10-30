/** Base URL used to build canonical links and structured metadata. */
export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://kasa-three-xi.vercel.app"
).replace(/\/+$/, "");

/**
 * Serializes structured data while escaping HTML-opening characters.
 *
 * @param value - JSON-LD data to serialize.
 * @returns A string safe to embed in an HTML script element.
 */
export function serializeJsonLd(value: Record<string, unknown>): string {
  return JSON.stringify(value).replace(/</g, "\\u003c");
}
