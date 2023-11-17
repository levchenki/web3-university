import hre from "hardhat";

async function main() {
    const [deployer] = await hre.viem.getWalletClients();

    console.log(`Deploying contracts with the account: ${deployer.account.address}`)

    const totalBalance = 10000n * BigInt(1e18);
    const token = await hre.viem.deployContract('Token', ['PudgeCoin', 'PDG', totalBalance]);

    console.log("Token address:", token.address);
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
