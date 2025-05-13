import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  eslint: {
    // ESLint 检查不会导致构建失败
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
