import {FC} from "react";
import {IPoster} from "../../types/posterInterfaces.tsx";
import {Card, CardBody, CardHeader, Divider, Link} from "@nextui-org/react";
import {sepoliaEtherscanURL, sliceAddress} from "../../utils/utils.ts";
import {Address} from "abitype";

// todo rewrite address slicing
export const PosterCard: FC<IPoster> = (poster) => {
    const {content, transactionHash, user} = poster

    return (
        <Card
            className='w-[35rem] px-2'
            radius='lg'
            shadow='md'>
            <CardHeader className='flex justify-between'>
                <h4 className="font-semibold text-default-700">
                    From: &nbsp;
                    <Link
                        isExternal
                        color='foreground'
                        href={`${sepoliaEtherscanURL}/address/${user}`}>
                        {sliceAddress(user as Address)}
                    </Link>
                </h4>
                <Link
                    isExternal
                    showAnchorIcon
                    href={`${sepoliaEtherscanURL}/tx/${transactionHash}`}>
                    Etherscan transaction
                </Link>
            </CardHeader>
            <Divider/>
            <CardBody className='py-8'>
                <h5 className='text-default-600'>{content}</h5>
            </CardBody>
        </Card>
    )
}