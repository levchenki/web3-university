import {Address} from "abitype";
import {getAccount, walletClient} from "../contracts/init.ts";
import {createJSONStorage, persist} from "zustand/middleware";
import {create} from "zustand";

interface AccountStore {
    address?: Address;
    isLoading: boolean;
    isConnected: boolean;

    connect: () => Promise<void>;
    disconnect: () => Promise<void>;
}


export const useAccount = create<AccountStore>()(
    persist((set) => ({
    address: '' as Address,
    isLoading: false,
    isConnected: false,
    connect: async () => {
        set({isLoading: true})

        await walletClient.requestAddresses().catch(e => {
            throw e
        })

        const account = await getAccount()

        if (!account) {
            throw new Error('No account')
        }

        set({
            isLoading: false,
            address: account,
            isConnected: !!account
        })
    },
        disconnect: async () => {
            set({
                address: '' as Address,
                isConnected: false
            })
        },

    }), {
        name: 'account-storage',
        storage: createJSONStorage(() => localStorage)
}))