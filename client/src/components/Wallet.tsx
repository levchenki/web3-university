import {FC, useEffect} from "react";
import {useAccount} from "../store/useAccount.ts";
import {sliceAddress} from "../utils/utils.ts";
import {Avatar, Button, useDisclosure} from "@nextui-org/react";
import {useToken} from "../store/useToken.ts";
import {ModalTokenTransaction} from "./modal/ModalTokenTransaction.tsx";
import {MdCurrencyExchange, MdRemoveRedEye} from "react-icons/md";


export const Wallet: FC = () => {
    const {isOpen, onOpen, onOpenChange} = useDisclosure();
    const {address, isConnected} = useAccount(state => ({
        address: state.address,
        isConnected: state.isConnected,
    }))
    const {balanceString, addDisplayToken, updateBalance, isTokenLoading} = useToken((state) => ({
        balanceString: state.balanceStr,
        addDisplayToken: state.addDisplayToken,
        updateBalance: state.updateBalance,
        isTokenLoading: state.isTokenLoading,
    }))


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
                                        {balanceString} PDG
                                    </h3>
                            }
                        </div>
                        : <h3 className='text-default-400 font-italic text-sm'>Not connected</h3>
                }
                <Button isIconOnly
                        size='sm'
                        variant='flat'
                        color='secondary'
                        disabled={!isConnected}
                        onClick={onOpen}>
                    <MdCurrencyExchange/>
                </Button>
                <Button isIconOnly
                        size='sm'
                        variant='flat'
                        color='secondary'
                        disabled={!isConnected}
                        onClick={addDisplayToken}>
                    <MdRemoveRedEye/>
                </Button>
            </div>
            <ModalTokenTransaction isOpen={isOpen} onOpenChange={onOpenChange}/>
        </>
    )
}
