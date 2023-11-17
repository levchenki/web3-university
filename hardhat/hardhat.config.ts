import {HardhatUserConfig} from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox-viem";

require('dotenv').config({path: '../.env'})

const config: HardhatUserConfig = {
    solidity: "0.8.20",
    networks: {
        sepolia: {
            url: process.env.SEPOLIA_URL,
            accounts: [process.env.PRIVATE_KEY ?? '']
        }
    },

    etherscan: {
        apiKey: process.env.ETHERSCAN_API_KEY
    }
};

export default config;
