import { defineConfig } from '@wagmi/cli'
import {sepolia} from "viem/chains";
import {etherscan} from "@wagmi/cli/plugins";

export default defineConfig({
  out: 'src/types/abi.ts',
  contracts: [],
  plugins: [
    etherscan({
      apiKey: process.env.ETHERSCAN_API_KEY,
      contracts: [
        {
          name: 'Poster',
          address: process.env.POSTER_CONTRACT_ADDRESS as `0x${string}`,
        },
        {
          name: 'Token',
          address: process.env.TOKEN_CONTRACT_ADDRESS as `0x${string}`,
        },
        {
          name: 'GatedPoster',
          address: process.env.GATED_POSTER_CONTRACT_ADDRESS as `0x${string}`,
        },
      ],
      chainId: sepolia.id,
    }),
  ]
})
