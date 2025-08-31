// next.config.mjs
/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ["images.unsplash.com"], // ✅ whitelist Unsplash
  },
};

export default nextConfig;
