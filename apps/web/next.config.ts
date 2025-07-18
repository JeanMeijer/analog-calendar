import type { NextConfig } from "next";
import withSimpleAnalytics from "@simpleanalytics/next/plugin";
import { withBotId } from "botid/next/config";

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
  webpack(config) {
    // Grab the existing rule that handles SVG imports
    // @ts-expect-error any
    const fileLoaderRule = config.module.rules.find((rule) =>
      rule.test?.test?.(".svg"),
    );

    config.module.rules.push(
      // Reapply the existing rule, but only for svg imports ending in ?url
      {
        ...fileLoaderRule,
        test: /\.svg$/i,
        resourceQuery: /url/, // *.svg?url
      },
      // Convert all other *.svg imports to React components
      {
        test: /\.svg$/i,
        issuer: fileLoaderRule.issuer,
        resourceQuery: { not: [...fileLoaderRule.resourceQuery.not, /url/] }, // exclude if *.svg?url
        use: ["@svgr/webpack"],
      },
    );

    // Modify the file loader rule to ignore *.svg, since we have it handled now.
    fileLoaderRule.exclude = /\.svg$/i;

    return config;
  },
  turbopack: {
    rules: {
      "*.svg": {
        loaders: ["@svgr/webpack"],
        as: "*.js",
      },
    },
  },
};

export default withSimpleAnalytics(withBotId(nextConfig));
