import path from "node:path";

import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  transpilePackages: ["@empathiq/shared", "@empathiq/database"],
  outputFileTracingRoot: path.join(__dirname, "../../"),
  outputFileTracingIncludes: {
    "/*": [
      "../../node_modules/.pnpm/@prisma+client*/node_modules/.prisma/client/**/*",
      "../../node_modules/.pnpm/@prisma+engines*/node_modules/@prisma/engines/**/*",
      "../../packages/database/prisma/**/*",
    ],
  },
  serverExternalPackages: ["@prisma/client", "prisma"],
};

export default nextConfig;
