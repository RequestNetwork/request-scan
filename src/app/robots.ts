/** @format */

import type { MetadataRoute } from "next";

// Deliberately allows crawling: pages must remain fetchable so crawlers can SEE
// the noindex signals (X-Robots-Tag header + robots meta tag). A `Disallow: /`
// here would hide the noindex and leave already-indexed pages stuck in Google.
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
    },
  };
}
