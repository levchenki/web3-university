import 'viem/window'
import {TokenContract} from "../contracts/contracts.ts";
import {getAccount} from "../contracts/init.ts";
import {Address} from "abitype";
import {createWithEqualityFn} from "zustand/traditional";

interface BalanceStore {
    balance: bigint;
    balanceString: string;
    isTransferring: boolean;
    isTokenLoading: boolean;

    transfer: (amount: bigint, to: Address) => Promise<void>
    setBalance: (balance: bigint) => void;
    updateBalance: () => Promise<void>;

    mint: (amount: bigint, to: Address) => Promise<void>;

    isListening: boolean;
    listenTransactions: () => Promise<void>;

    addDisplayToken: () => Promise<void>;
}

// todo add persist
// todo string balance
export const useToken = createWithEqualityFn<BalanceStore>()(
    (set, get) => ({
        balance: 0n,
        balanceString: '0',
        isListening: false,
        isTransferring: false,
        isTokenLoading: false,

        setBalance: (balance: bigint) => set({balance}),
        updateBalance: async () => {
            const address = await getAccount();
            if (!address) {
                return;
            }
            const balance = await TokenContract.read.balanceOf([address]);
            set({
                balance: balance ? BigInt(balance) : 0n,
                balanceString: balance ? BigInt(balance).toString() : '0',
            });
        },

        transfer: async (amount: bigint, to: Address) => {
            const address = await getAccount();
            if (!address) {
                throw new Error('No account')
            }

            if (get().balance < amount) {
                throw new Error('Not enough balance')
            }
            set({isTransferring: true})

            await TokenContract.write.transfer([to, amount], {account: address})
                .catch(e => {
                    throw e
                })
                .finally(() => {
                    set({isTransferring: false})
                })
        },

        mint: async (amount: bigint, to?: Address) => {
            const address = await getAccount();

            if (!address) {
                throw new Error('No account')
            }

            if (!to) {
                to = address
            }

            set({isTransferring: true})
            await TokenContract.write.mint([to, amount], {account: address})
                .catch(e => {
                    throw e
                })
                .finally(() => {
                    set({isTransferring: false})
                })
        },

        listenTransactions: async () => {
            const address = await getAccount();
            if (!address || get().isListening) {
                return
            }

            set({isListening: true})
            TokenContract.watchEvent.Transfer({}, {
                onLogs: (logs) => logs.map(log => {
                    const {from, to, value} = log.args
                    if (!from || !to || !value) {
                        return
                    }

                    if (address === from) {
                        const balance = get().balance - value
                        set({
                            balance: balance > 0n ? balance : 0n,
                            balanceString: balance > 0n ? balance.toString() : '0'
                        })
                    }

                    if (address === to) {
                        const balance = get().balance + value
                        set({
                            balance: balance > 0n ? balance : 0n,
                            balanceString: balance > 0n ? balance.toString() : '0'
                        })

                    }
                })
            })
        },

        addDisplayToken: async () => {
            if (!window.ethereum) {
                throw new Error('No ethereum provider')
            }

            await window.ethereum.request({
                method: 'wallet_watchAsset',
                params: {
                    type: 'ERC20',
                    options: {
                        address: TokenContract.address,
                        symbol: await TokenContract.read.symbol(),
                        decimals: await TokenContract.read.decimals(),
                    },
                },
            });
        },
    }));