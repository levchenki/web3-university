import {FC} from "react";
import {ConnectWallet} from "../components/ConnectWallet.tsx";
import {Navbar, NavbarContent, NavbarItem} from "@nextui-org/react";

export const Header: FC = () => {

    return (
        <header>
            header
            <Navbar className='px-10 py-3'>
                <NavbarContent justify="end">
                    <NavbarItem>
                        <ConnectWallet/>
                    </NavbarItem>
                </NavbarContent>
            </Navbar>

        </header>
    )
}