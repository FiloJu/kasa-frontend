import type { MetadataRoute } from "next";
import { getProperties } from "@/lib/properties";
import { SITE_URL } from "@/lib/seo";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const properties = await getProperties();

  return [
    {
      url: `${SITE_URL}/home`,
      priority: 1,
    },
    {
      url: `${SITE_URL}/properties`,
      priority: 0.9,
    },
    {
      url: `${SITE_URL}/about`,
      priority: 0.5,
    },
    ...properties.map((property) => ({
      url: `${SITE_URL}/properties/${property.id}`,
      priority: 0.8,
    })),
  ];
}
