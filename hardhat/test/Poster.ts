import "@nomicfoundation/hardhat-viem/internal/type-extensions";
import hre from "hardhat";
import {loadFixture} from "@nomicfoundation/hardhat-toolbox-viem/network-helpers";
import {expect} from "chai";
import web3 from 'web3'

describe('Poster', () => {

    async function deployPosterFixture() {
        const [owner, otherAccount] = await hre.viem.getWalletClients();

        const poster = await hre.viem.deployContract('Poster');

        return {
            owner,
            otherAccount,
            poster
        }
    }

    describe('Poster contract', () => {
        it('Should contain 0 events before post', async () => {
            const {poster} = await loadFixture(deployPosterFixture);

            const eventsBefore = await poster.getEvents.NewPost();
            expect(eventsBefore.length).to.equal(0);
        });

        it('Should contain 1 event after post', async () => {
            const {poster} = await loadFixture(deployPosterFixture);

            const content = 'Hello world';
            const tag = 'hello';

            await poster.write.post([content, tag]);
            const eventsAfter = await poster.getEvents.NewPost();
            expect(eventsAfter.length).to.equal(1);
        });

        it('Should be with the correct data in the contract', async () => {
            const {poster, owner} = await loadFixture(deployPosterFixture);

            const content = 'Hello world';
            const tag = 'hello';
            await poster.write.post([content, tag]);

            const eventsAfter = await poster.getEvents.NewPost();
            const postedEvent = eventsAfter[0];

            expect(postedEvent.args.user?.toLowerCase()).to.equal(owner.account.address.toLowerCase())
            expect(postedEvent.args.content).to.equal(content)
            expect(postedEvent.args.tag).to.equals(web3.utils.keccak256(tag))
        });
    })
})