import hre from "hardhat";
import {isAddress} from "viem";

async function main() {
    const [deployer] = await hre.viem.getWalletClients();
    const tokenAddress = process.env.TOKEN_CONTRACT_ADDRESS ?? '0x0'
    const threshold = 1n

    console.log(`Deploying contracts with the account: ${deployer.account.address}`)

    if (!isAddress(tokenAddress)) {
        console.log('Token address format error')
        return
    }

    const poster = await hre.viem.deployContract('GatedPoster', [tokenAddress, threshold]);

    console.log("Contract address:", poster.address);
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
