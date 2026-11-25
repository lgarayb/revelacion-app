import type { MetadataRoute } from "next";
import dbConnect from "@/lib/mongodb";
import Package from "@/models/Package";

export const dynamic = "force-dynamic";

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL || "https://revelacion-app.vercel.app";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: SITE_URL,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: `${SITE_URL}/paquetes`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${SITE_URL}/legal`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.3,
    },
  ];

  try {
    await dbConnect();
    const packages = await Package.find({ isActive: true })
      .select("slug updatedAt")
      .lean();

    const packageRoutes: MetadataRoute.Sitemap = packages
      .filter((pkg: any) => Boolean(pkg?.slug))
      .map((pkg: any) => ({
        url: `${SITE_URL}/paquetes/${pkg.slug}`,
        lastModified: pkg.updatedAt ? new Date(pkg.updatedAt) : new Date(),
        changeFrequency: "weekly",
        priority: 0.8,
      }));

    return [...staticRoutes, ...packageRoutes];
  } catch (error) {
    console.error("Error generando sitemap:", error);
    return staticRoutes;
  }
}