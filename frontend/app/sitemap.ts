import { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://restrosaas.com";

  const routes = ["", "/features", "/pricing", "/faq", "/login", "/register"].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date().toISOString(),
    changeFrequency: route === "" ? ("daily" as const) : ("weekly" as const),
    priority: route === "" ? 1.0 : route === "/features" || route === "/pricing" ? 0.9 : 0.8,
  }));

  return routes;
}
