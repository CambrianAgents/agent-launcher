/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  env: {
    RPC_URL: process.env.RPC_URL,
    // Don't expose SEI_PRIVATE_KEY on client
  },
  // This ensures the API routes have access to environment variables
  serverRuntimeConfig: {
    RPC_URL: process.env.RPC_URL,
    SEI_PRIVATE_KEY: process.env.SEI_PRIVATE_KEY,
    OPENAI_API_KEY: process.env.OPENAI_API_KEY,
  },
}

export default nextConfig
