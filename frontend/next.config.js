module.exports = {
  reactStrictMode: false,
  webpack: (config) => {
    config.resolve.fallback = { fs: false, net: false };
    return config;
  },
  env: {
    CONTRACT_ADDR: "0x5fbdb2315678afecb367f032d93f642f64180aa3",
  },
};
