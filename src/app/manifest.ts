import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Sigma Finance",
    short_name: "Sigma",
    description: "Sigma Finance gives every DeFi user a quant desk in their pocket—deposit once, let AI hunt the yield.",
    start_url: "/",
    icons: [
      {
        src: "/web-app-manifest-192x192.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "maskable",
      },
      {
        src: "/web-app-manifest-512x512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
    ],
    display: "standalone",
    background_color: "#0D131A",
    theme_color: "#0D131A",
  };
}
