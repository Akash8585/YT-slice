import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const siteUrl = "https://ytplaylistlength.acash.dev";
  const pages = [
    {
      path: "/",
      priority: 1,
    },
    {
      path: "/how-to-calculate-youtube-playlist-length",
      priority: 0.8,
    },
    {
      path: "/custom-youtube-playlist-range-calculator",
      priority: 0.8,
    },
  ];

  return pages.map((page) => ({
    url: `${siteUrl}${page.path}`,
    lastModified: new Date(),
    changeFrequency: "weekly",
    priority: page.priority,
  }));
}
