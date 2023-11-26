import 'viem/window'
import {TokenContract} from "../contracts/contracts.ts";
import {getAccount} from "../contracts/init.ts";
import {Address} from "abitype";
import {createWithEqualityFn} from "zustand/traditional";
import {createJSONStorage, persist} from "zustand/middleware";
import {toast} from "react-toastify";
import {bigintToStr} from "../utils/utils.ts";

interface BalanceStore {
    balance: bigint;
    balanceStr: string;
    isTransferring: boolean;
    isTokenLoading: boolean;


    transfer: (amount: bigint, to: Address) => Promise<void>
    updateBalance: () => Promise<void>;

    mint: (amount: bigint, to: Address) => Promise<void>;

    listenTransactions: () => Promise<void>;

    isOwner: boolean;
    setOwner: () => Promise<void>;

    addDisplayToken: () => Promise<void>;
}


export const useToken = createWithEqualityFn<BalanceStore>()(
    persist((set, get) => ({
        balance: 0n,
        balanceStr: '0',
        isListening: false,
        isTransferring: false,
        isTokenLoading: false,
        isOwner: false,

        updateBalance: async () => {
            const address = await getAccount();
            if (!address) {
                return;
            }
            const balance = await TokenContract.read.balanceOf([address]);
            set({
                balance: balance,
                balanceStr: bigintToStr(balance),
            })
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
            if (!address) {
                return;
            }

            TokenContract.watchEvent.Transfer({}, {
                onLogs: (logs) => logs.map(log => {
                    const {from, to, value} = log.args
                    if (!from || !to || !value) {
                        return
                    }

                    if (address === from) {
                        const balance = get().balance - value
                        set({
                            balance: balance,
                            balanceStr: bigintToStr(balance)
                        })
                    }

                    if (address === to) {
                        const balance = get().balance + value
                        set({
                            balance: balance,
                            balanceStr: bigintToStr(balance)
                        })

                    }
                })
            })
        },

        setOwner: async () => {
            const address = await getAccount();
            if (!address) {
                return;
            }

            const owner = await TokenContract.read.owner()
            set({isOwner: owner === address})
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
    }), {
        name: 'token',
        storage: createJSONStorage(() => localStorage),
        partialize: (state) => ({
            balanceStr: state.balanceStr,
            isTransferring: state.isTransferring,
            isTokenLoading: state.isTokenLoading,
        }),
        onRehydrateStorage: (state) => {
            state.setOwner().catch(e => toast.error(e.message))
            state.listenTransactions().catch(e => toast.error(e.message))
        }
    }));