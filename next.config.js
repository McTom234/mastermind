/* eslint-disable @typescript-eslint/no-var-requires */
const StylelintPlugin = require("stylelint-webpack-plugin");

/** @type {import('next').NextConfig} */
const nextConfig = {
    experimental: {
        appDir: true,
        typedRoutes: true,
    },
    reactStrictMode: true,
    webpack: (config) => {
        config.plugins.push(new StylelintPlugin());
        return config;
    },
};

module.exports = nextConfig;
