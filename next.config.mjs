/** @type {import('next').NextConfig} */
const nextConfig = {
  async headers() {
    return [
      {
        // All routes: pages, API and asset responses included
        source: "/:path*",
        headers: [{ key: "X-Robots-Tag", value: "noindex, nofollow" }],
      },
    ];
  },
};

export default nextConfig;
