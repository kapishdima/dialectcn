import type { MetadataRoute } from "next";
import { listIndexableForSitemap } from "@/lib/services/presets";

export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = process.env.BETTER_AUTH_URL ?? "https://dialectcn.app";
  const staticPaths: MetadataRoute.Sitemap = [
    { url: `${base}/`, changeFrequency: "weekly" },
    { url: `${base}/feed`, changeFrequency: "daily" },
    { url: `${base}/submit`, changeFrequency: "monthly" },
  ];
  const presets = await listIndexableForSitemap();
  return [
    ...staticPaths,
    ...presets.map((p) => ({
      url: `${base}/feed/${p.code}`,
      lastModified: p.updatedAt,
      changeFrequency: "weekly" as const,
    })),
  ];
}
