/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  // Disable Next 15 devtools overlay & segment explorer which causes React Client Manifest HMR crashes
  devIndicators: false,
  images: {
    unoptimized: true,
  },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "Access-Control-Allow-Origin", value: "*" },
          { key: "Access-Control-Allow-Methods", value: "GET,POST,OPTIONS" },
          { key: "Access-Control-Allow-Headers", value: "Content-Type" },
        ],
      },
    ];
  },
  async rewrites() {
    return [
      // Backward-compatible rewrites for legacy OBS scene URLs
      { source: "/overlays/game-overlay.html", destination: "/overlays/game" },
      { source: "/overlays/chatting-react.html", destination: "/overlays/chatting" },
      { source: "/overlays/starting-soon.html", destination: "/overlays/starting" },
      { source: "/overlays/brb.html", destination: "/overlays/brb" },
      { source: "/overlays/stream-ending.html", destination: "/overlays/ending" },
      { source: "/dashboard/index.html", destination: "/dashboard" },
    ];
  },
};

export default nextConfig;
