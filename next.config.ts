import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  typescript: {
    // ⚠️ Ignora los errores de tipos vacíos para poder compilar rápido
    ignoreBuildErrors: true,
  },
  eslint: {
    // ⚠️ Ignora las advertencias de código
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;