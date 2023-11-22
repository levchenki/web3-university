import {FC} from "react";
import {Button, Spinner} from "@nextui-org/react";
import {useAccount} from "../store/useAccount.ts";
import {toast} from "react-toastify";

export const ConnectWallet: FC = () => {
    const {isConnected, isLoading, connect, disconnect} = useAccount(state => ({
        isConnected: state.isConnected,
        isLoading: state.isLoading,
        connect: state.connect,
        disconnect: state.disconnect,
    }));

    const buttonColor = isConnected ? 'primary' : 'danger';
    const buttonText = isConnected ? 'Connected' : 'Sign in';

    const handleConnect = () => {
        connect().catch(e => toast.error(e.message));
    }

    const handleDisconnect = () => {
        disconnect().catch(e => toast.error(e.message));
    }

    return (
        <Button color={buttonColor}
                onClick={isConnected ? handleDisconnect : handleConnect}>
            {
                isLoading && <Spinner size='sm' color='white'/>
            }
            {buttonText}
        </Button>
    )
}
