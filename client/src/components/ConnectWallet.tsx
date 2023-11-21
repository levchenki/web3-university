import {FC, useEffect} from "react";
import {Button, Spinner} from "@nextui-org/react";
import {useAccount} from "../store/useAccount.ts";

export const ConnectWallet: FC = () => {
    const {isConnected, isLoading, connect, reconnect} = useAccount()

    const buttonColor = isConnected ? 'primary' : 'danger';
    const buttonText = isConnected ? 'Connected' : 'Sign in';

    useEffect(() => {
        reconnect().catch(console.error);
    }, [reconnect]);

    return (
        <Button color={buttonColor}
                onClick={connect}
                disabled={isLoading || isConnected}>
            {
                isLoading && <Spinner size='sm' color='white'/>
            }
            {buttonText}
        </Button>
    )
}
