import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "image.tmdb.org",
        pathname: "/t/p/**",
      },
      {
        protocol: "https",
        hostname: "picsum.photos",
      },
      // Logos do Watchmode
      {
        protocol: "https",
        hostname: "cdn.watchmode.com",
      },
      // Logos do Streaming Availability (Movie of the Night)
      {
        protocol: "https",
        hostname: "media.movieofthenight.com",
      },
    ],
  },
};

export default nextConfig;
