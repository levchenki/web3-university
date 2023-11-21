import {getContract} from "viem";
import {gatedPosterABI, gatedPosterAddress, posterABI, posterAddress, tokenABI, tokenAddress} from "../types/abi.ts";
import {publicClient, walletClient} from "./init.ts";
import {sepolia} from "viem/chains";


export const PosterContract = getContract({
    abi: posterABI,
    address: posterAddress[sepolia.id],
    walletClient: walletClient,
    publicClient: publicClient
});

export const GatedPosterContract = getContract({
    abi: gatedPosterABI,
    address: gatedPosterAddress[sepolia.id],
    walletClient: walletClient,
    publicClient: publicClient
});

export const TokenContract = getContract({
    abi: tokenABI,
    address: tokenAddress[sepolia.id],
    walletClient: walletClient,
    publicClient: publicClient
});
