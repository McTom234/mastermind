/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
};

if (process.env.ENV === 'development') {
  import('stylelint-webpack-plugin').then((StylelintWebpackPlugin) => {
    nextConfig.webpack = (config) => {
      config.plugins.push(new StylelintWebpackPlugin());
      return config;
    };
  });
}

export default nextConfig;
