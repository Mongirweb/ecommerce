/** @type {import('next').NextConfig} */
const { hostname } = require("os");
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
  experimental: {
    missingSuspenseWithCSRBailout: false,
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
    ],
  }, // <- Closing brace for the `images` object
}); // <- Closing parenthesis for the `nextConfig` object

module.exports = nextConfig;
