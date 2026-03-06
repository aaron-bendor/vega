import { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: "/", lastModified: new Date(), changeFrequency: "weekly", priority: 1 },
    { url: "/vega-financial", lastModified: new Date(), changeFrequency: "weekly", priority: 0.95 },
    { url: "/vega-financial/marketplace", lastModified: new Date(), changeFrequency: "weekly", priority: 0.9 },
    { url: "/vega-financial/portfolio", lastModified: new Date(), changeFrequency: "weekly", priority: 0.8 },
    { url: "/vega-developer", lastModified: new Date(), changeFrequency: "monthly", priority: 0.7 },
  ];
}
