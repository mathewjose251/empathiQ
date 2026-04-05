import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  transpilePackages: ["@empathiq/shared", "@empathiq/database"],
};

export default nextConfig;
