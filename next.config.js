/** @type {import('next').NextConfig} */
const path = require("path");
const withBundleAnalyzer = require("@next/bundle-analyzer")({
  enabled: process.env.ANALYZE === "true",
});

const nextConfig = withBundleAnalyzer({
  reactStrictMode: true,
  swcMinify: true,
  sassOptions: {
    includePaths: [path.join(__dirname, "styles")],
    prependData: `@import "./base.scss";`,
  },
  modularizeImports: {
    lodash: { transform: "lodash/{{member}}" },
    "date-fns": { transform: "date-fns/{{member}}" },
  },
  experimental: {
    missingSuspenseWithCSRBailout: false,
    optimizePackageImports: ["react-icons"],
  },

  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
      },
      {
        protocol: "https",
        hostname: "www.googletagmanager.com",
      },
      {
        protocol: "https",
        hostname: "www.google-analytics.com",
      },
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
      },
      {
        protocol: "https",
        hostname: "www.pngmart.com",
      },
      {
        protocol: "https",
        hostname: "www.freeiconspng.com",
      },
      {
        protocol: "https",
        hostname: "cdn.shopify.com",
        pathname: "/s/files/**",
      },
      {
        protocol: "https",
        hostname: "cdn.shopifycdn.com",
        pathname: "/shopify/**",
      },
      {
        protocol: "https",
        hostname: "cdn.shopifycdn.net",
        pathname: "/shopify/**",
      },
      {
        protocol: "https",
        hostname: "papeleriaelrio.com.co",
      },
      {
        protocol: "https",
        hostname: "pinateriaelrio.com",
      },
      {
        protocol: "https",
        hostname: "pinateriaelrio.com.co",
      },
      {
        protocol: "https",
        hostname: "s3.amazonaws.com",
      },
    ],
  },

  // 1) Add an async rewrites() block:
  async rewrites() {
    return [
      {
        source: "/merchant-feed.xml", // Google Merchant Center fetches here
        destination: "/api/merchant-feed", // Our route returning the XML feed
      },
    ];
  },
});

module.exports = nextConfig;
