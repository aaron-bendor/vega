/** @type {import('next').NextConfig} */
const nextConfig = {
  async redirects() {
    return [
      { source: "/marketplace", destination: "/vega-financial/marketplace", permanent: true },
      { source: "/portfolio", destination: "/vega-financial/portfolio", permanent: true },
      { source: "/algo/:id", destination: "/vega-financial/algorithms/:id", permanent: true },
      { source: "/developer", destination: "/vega-developer", permanent: true },
    ];
  },
};

export default nextConfig;
