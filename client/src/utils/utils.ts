import {Address} from "abitype";
import {keccak256, toHex} from "viem";

export const sliceAddress = (address?: Address) => {
    if (!address) return '';

    const length = address.length;
    const first = 6;
    const last = 4;
    return address.slice(0, first) + '...' + address.slice(length - last, length);
}

export const encryptKeccak256 = (str: string) => {
    return keccak256(toHex(str));
}

export const convertToken = (amount: bigint, decimals: number = 18) => {
    const x = amount / BigInt(10 ** decimals)
    return Number(x);
}

export const sepoliaEtherscanURL = 'https://sepolia.etherscan.io'