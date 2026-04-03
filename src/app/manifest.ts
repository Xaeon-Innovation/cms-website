import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Creative Multi Solutions",
    short_name: "CMS",
    description: "Bespoke medical marketing and patient acquisition.",
    start_url: "/",
    display: "browser",
    icons: [
      {
        src: "/favicon.ico",
        sizes: "any",
        type: "image/x-icon",
      },
    ],
  };
}
