import hre from "hardhat";

async function main() {
    const [deployer] = await hre.viem.getWalletClients();

    console.log(`Deploying contracts with the account: ${deployer.account.address}`)

    const poster = await hre.viem.deployContract('Poster');

    console.log("Token address:", poster.address);
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
