import {FC, useEffect} from "react";
import {useAccount} from "../store/useAccount.ts";
import {formatBigint, sliceAddress} from "../utils/utils.ts";
import {Avatar, Button, useDisclosure} from "@nextui-org/react";
import {useToken} from "../store/useToken.ts";
import {ModalTokenTransaction} from "./modal/ModalTokenTransaction.tsx";

// todo rewrite
export const Wallet: FC = () => {
    const {isOpen, onOpen, onOpenChange} = useDisclosure();
    const {address, isConnected} = useAccount(state => ({
        address: state.address,
        isConnected: state.isConnected,
    }))
    const {balanceString, addDisplayToken, updateBalance, listenTransactions, isTokenLoading} = useToken((state) => ({
        balanceString: state.balanceString,
        addDisplayToken: state.addDisplayToken,
        updateBalance: state.updateBalance,
        listenTransactions: state.listenTransactions,
        isTokenLoading: state.isTokenLoading,
    }))

    useEffect(() => {
        if (!isConnected)
            return

        listenTransactions().catch(console.error)
    }, [listenTransactions, isConnected]);

    useEffect(() => {
        if (!isConnected)
            return

        updateBalance().catch(console.error)
    }, [updateBalance, isConnected]);

    return (
        <>
            <div className='flex flex-row gap-3 items-center'>
                <Avatar/>
                {
                    isConnected
                        ? <div className='flex flex-col'>
                            <h3 className='text-default-700 font-bold'>{sliceAddress(address)}</h3>
                            {
                                isTokenLoading ? <h3 className='text-default-400 font-italic text-sm'>Loading...</h3>
                                    :
                                    <h3 className='text-default-400 font-italic text-sm'>
                                        {formatBigint(balanceString)} PDG
                                    </h3>
                            }
                        </div>
                        : <h3 className='text-default-400 font-italic text-sm'>Not connected</h3>
                }
                <Button isIconOnly
                        size='sm'
                        variant='flat'
                        disabled={!isConnected}
                        onClick={onOpen}>
                    Send
                </Button>
                <Button isIconOnly
                        size='sm'
                        variant='flat'
                        disabled={!isConnected}
                        onClick={addDisplayToken}>
                    S
                </Button>
            </div>
            <ModalTokenTransaction isOpen={isOpen} onOpenChange={onOpenChange}/>
        </>
    )
}
