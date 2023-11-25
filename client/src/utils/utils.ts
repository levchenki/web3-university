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

// todo rework
export const convertToken = (amount: bigint, decimals: number = 18) => {
    const x = amount / BigInt(10 ** decimals)
    return Number(x);
}

export const parseStrToBigint = (str: string, decimals: number = 18) => {
    const isDecimal = str.includes('.');

    if (isDecimal) {
        const [wholePart, fractionalPart] = str.split('.');

        const truncatedFractionalPart = fractionalPart.slice(0, decimals);
        const paddedFractionalPart = truncatedFractionalPart.padEnd(decimals, '0');

        const wholeBigInt = BigInt(wholePart);
        const fractionalBigInt = BigInt(paddedFractionalPart);

        return wholeBigInt * BigInt(10 ** decimals) + fractionalBigInt;
    } else {
        return BigInt(str) * BigInt(10 ** decimals);
    }
}

export const parseBigintToStr = (amount: bigint, decimals: number = 18) => {
    const amountStr = amount.toString();
    const amountLength = amountStr.length;

    const wholePart = amountStr.slice(0, amountLength - decimals);
    const fractionalPart = amountStr.slice(amountLength - decimals, amountLength);

    return `${wholePart}.${fractionalPart}`;
}

export const formatBigint = (amount?: string, decimals: number = 18) => {
    if (!amount) return '0.000';

    const amountLength = amount.length;
    const numsAfterDot = 3;

    const wholePart = amount.slice(0, amountLength - decimals);
    const fractionalPart = amount.slice(amountLength - decimals, amountLength - decimals + numsAfterDot);

    return `${wholePart}.${fractionalPart}`;
}

export const sepoliaEtherscanURL = 'https://sepolia.etherscan.io'