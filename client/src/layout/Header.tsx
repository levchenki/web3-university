import {FC} from "react";
import {ConnectWallet} from "../components/ConnectWallet.tsx";
import {Navbar, NavbarContent, NavbarItem} from "@nextui-org/react";
import {Wallet} from "../components/Wallet.tsx";

export const Header: FC = () => {

    return (
        <header>
            <Navbar className='px-10 py-3'>
                <NavbarContent justify="start">
                    <NavbarItem>
                        <Wallet/>
                    </NavbarItem>
                </NavbarContent>
                <NavbarContent justify="end">
                    <NavbarItem>
                        <ConnectWallet/>
                    </NavbarItem>
                </NavbarContent>
            </Navbar>

        </header>
    )
}