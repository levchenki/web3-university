import "@nomicfoundation/hardhat-viem/internal/type-extensions";
import hre from "hardhat";
import {loadFixture} from "@nomicfoundation/hardhat-toolbox-viem/network-helpers";
import {expect} from "chai";

describe('Token', () => {

    async function deployPosterFixture() {
        const [owner, otherAccount] = await hre.viem.getWalletClients();

        const totalBalance = 10000n * BigInt(1e18);
        const token = await hre.viem.deployContract('Token', ['Pudgenium', 'PDG', totalBalance]);

        return {
            owner,
            otherAccount,
            token
        }
    }

    describe('Token creation', () => {
        it('Should assign balance when created', async () => {
            const {token, owner} = await loadFixture(deployPosterFixture)

            const totalBalance = await token.read.totalSupply()

            const ownerAddress = owner.account.address
            const ownerBalance = await token.read.balanceOf([ownerAddress]).then(BigInt)

            expect(totalBalance).to.equal(ownerBalance)
        });

        it('Should have 1 Transfer event after deploy', async () => {
            const {token} = await loadFixture(deployPosterFixture);

            const transferEvents = await token.getEvents.Transfer();
            expect(transferEvents.length).to.equal(1);
        })
    });

    describe('Token transaction', () => {
        it('Should mint tokens', async () => {
            const {token, owner, otherAccount} = await loadFixture(deployPosterFixture)

            const mintedAmount = 10n * BigInt(1e18)
            const destinationAddress = otherAccount.account.address

            const tx = await token.write.mint([destinationAddress, mintedAmount], {account: owner.account})

            expect(tx).not.empty;

            const transferEvents = await token.getEvents.Transfer({to: destinationAddress})
            const transactionLog = transferEvents[0]

            expect(transactionLog.eventName).to.equal('Transfer');
            expect(transactionLog.args.from).to.equal('0x0000000000000000000000000000000000000000');

            const destinationToLowerCase = transactionLog.args.to?.toLowerCase();

            expect(destinationToLowerCase).to.equal(destinationAddress);
            expect(transactionLog.args.value).to.equal(mintedAmount)

            try {
                await token.write.mint([destinationAddress, mintedAmount], {account: otherAccount.account});
                expect.fail('unreachable');
            } catch (error) {
                expect(error).to.match(new RegExp('Ownable: caller is not the owner'));
            }
        });
    })
})