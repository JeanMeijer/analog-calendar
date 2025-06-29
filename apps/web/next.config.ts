import type { NextConfig } from "next";
import withSimpleAnalytics from "@simpleanalytics/next/plugin";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: "/discord",
        destination: "https://discord.gg/K3AsABDKUm",
        permanent: false,
      },
    ];
  },
};

export default withSimpleAnalytics(nextConfig);
