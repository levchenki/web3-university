import "@nomicfoundation/hardhat-viem/internal/type-extensions";
import hre from "hardhat";
import {loadFixture} from "@nomicfoundation/hardhat-toolbox-viem/network-helpers";
import {expect} from "chai";
import web3 from "web3";

describe('Gated Poster contract', () => {

    async function deployPosterFixture() {
        const [owner, otherAccount] = await hre.viem.getWalletClients();

        const totalBalance = 10n * BigInt(1e18);
        const token = await hre.viem.deployContract('Token', ['Pudgenium', 'PDG', totalBalance]);

        const tokenAddress = token.address
        const poster = await hre.viem.deployContract('GatedPoster', [tokenAddress, BigInt(1)]);

        return {
            owner,
            otherAccount,
            poster,
            token
        }
    }

    it('Should contain 0 events before post', async () => {
        const {poster} = await loadFixture(deployPosterFixture);

        const eventsBefore = await poster.getEvents.NewPost();
        expect(eventsBefore.length).to.equal(0);
    });

    it('Should be sent if sender has tokens', async () => {
        const {poster, owner} = await loadFixture(deployPosterFixture);

        const content = "Hello world!";
        const tag = "hello";

        await poster.write.post([content, tag]);
        const eventsAfter = await poster.getEvents.NewPost();
        const gatedPostedEvents = eventsAfter[0];

        expect(gatedPostedEvents.args.user?.toLowerCase()).to.equal(owner.account.address.toLowerCase());
        expect(gatedPostedEvents.args.content).to.equal(content);
        expect(gatedPostedEvents.args.tag).to.equals(web3.utils.keccak256(tag));
    });

    it('Should throw error if sender has not tokens', async () => {
        const {poster, token, otherAccount} = await loadFixture(deployPosterFixture);

        const otherAccountAddress = otherAccount.account.address;
        expect(await token.read.balanceOf([otherAccountAddress])).to.equal(0n);

        const content = "Hello world!";
        const tag = "hello";

        try {
            await poster.write.post([content, tag], {account: otherAccount.account});
        } catch (e) {
            expect(e).to.exist;
        }
    });
});