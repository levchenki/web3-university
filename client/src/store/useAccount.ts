import {create} from "zustand";
import {Address} from "abitype";
import {getAccount, walletClient} from "../contracts/init.ts";

interface AccountStore {
    address?: Address;
    isLoading: boolean;
    isConnected: boolean;

    connect: () => Promise<void>;
    reconnect: () => Promise<void>;
}


export const useAccount = create<AccountStore>((set) => ({
    address: '' as Address,
    isLoading: false,
    isConnected: false,
    connect: async () => {
        set({isLoading: true})

        await walletClient.requestAddresses().catch(e => {
            alert(e)
        })

        const account = await getAccount()

        set({
            isLoading: false,
            address: account,
            isConnected: !!account
        })
    },
    reconnect: async () => {
        const account = await getAccount()
        if (account) {
            set({
                address: account,
                isConnected: true
            })
        }
    }
}))
