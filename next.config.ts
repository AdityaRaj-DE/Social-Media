import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */

  output: "standalone",
  experimental: {
    turbo: {
      rules: {
        "*.css": {
          loaders: ["@tailwindcss/next"],
        },
      },
    },
  },
  images: {
    domains: ["res.cloudinary.com"],
  },
};

export default nextConfig;
