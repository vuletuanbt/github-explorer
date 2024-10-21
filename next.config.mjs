/** @type {import('next').NextConfig} */
const productionConfig = process.env.NODE_ENV == "production" && {
  output: "standalone",
};
const nextConfig = {
  ...productionConfig,
  images: {
    domains: ["avatars.githubusercontent.com"],
  },
  reactStrictMode: false,
};

export default nextConfig;
