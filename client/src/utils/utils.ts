import { Address } from 'abitype';
import { keccak256, toHex } from 'viem';

export const sliceAddress = (address?: Address) => {
    if (!address) return '';

    const length = address.length;
    const first = 6;
    const last = 4;
    return address.slice(0, first) + '...' + address.slice(length - last, length);
};

export const encryptKeccak256 = (str: string) => {
    return keccak256(toHex(str));
};

export const strToBigint = (str: string, decimals: number = 18) => {
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
};

export const bigintToStr = (amount: bigint | string, decimals: number = 18) => {
    const amountStr = typeof amount === 'string' ? amount : amount.toString();

    if (amountStr === '0') return '0';

    const amountLength = amountStr.length;

    const wholePart = amountStr.slice(0, amountLength - decimals);
    const fractionalPart = amountStr.slice(amountLength - decimals, amountLength);
    const numsAfterDot = 3;

    const truncatedFractionalPart = fractionalPart.slice(0, numsAfterDot);

    return `${wholePart}.${truncatedFractionalPart}`;
};

export const sepoliaEtherscanURL = 'https://sepolia.etherscan.io';
