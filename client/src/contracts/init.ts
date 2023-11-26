import { createPublicClient, createWalletClient, custom, http } from 'viem';
import { sepolia } from 'viem/chains';
import 'viem/window';

const infuraUrl = 'https://sepolia.infura.io/v3/';
const infuraKey = import.meta.env.VITE_INFURA_API_KEY;

export const publicClient = createPublicClient({
    chain: sepolia,
    transport: http(`${infuraUrl}${infuraKey}`),
});

export const walletClient = createWalletClient({
    chain: sepolia,
    transport: window.ethereum ? custom(window.ethereum) : http(),
});

export const getAccount = async (): Promise<`0x${string}` | undefined> => {
    const [account] = await walletClient.getAddresses();
    return account ?? undefined;
};
