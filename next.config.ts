import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin();
const backendUrl = (
  process.env.API_INTERNAL_URL ||
  process.env.NEXT_PUBLIC_API_URL ||
  "https://khaicode-backend.centralcenter.tech"
).replace(/\/$/, "");

const nextConfig: NextConfig = {
  output: "standalone",
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "khai-code.s3.amazonaws.com",
      },
    ],
  },
  async rewrites() {
    return [
      {
        source: "/auth/:path*",
        destination: `${backendUrl}/auth/:path*`,
      },
      {
        source: "/users/:path*",
        destination: `${backendUrl}/users/:path*`,
      },
      {
        source: "/products/:path*",
        destination: `${backendUrl}/products/:path*`,
      },
      {
        source: "/category/:path*",
        destination: `${backendUrl}/category/:path*`,
      },
      {
        source: "/payment/:path*",
        destination: `${backendUrl}/payment/:path*`,
      },
    ];
  },
};

export default withNextIntl(nextConfig);
