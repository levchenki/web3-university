import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox-viem";

require("dotenv").config({ path: "../.env" });

const sepoliaUrl = `https://sepolia.infura.io/v3/${process.env.VITE_INFURA_API_KEY}`;

const config: HardhatUserConfig = {
  solidity: "0.8.20",
  networks: {
    sepolia: {
      url: sepoliaUrl,
      accounts: [process.env.PRIVATE_KEY ?? ""],
    },
  },

  etherscan: {
    apiKey: process.env.ETHERSCAN_API_KEY,
  },
};

export default config;
