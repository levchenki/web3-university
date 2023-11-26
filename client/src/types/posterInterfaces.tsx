import { PosterContract } from '../contracts/contracts.ts';

export type TPostEvent = Awaited<ReturnType<typeof PosterContract.getEvents.NewPost>>[number];

export interface IPoster {
    tag: string;
    content: string;
    user: string;
    transactionHash: string;
}

export interface IPostParams {
    tag: string;
    content: string;
}
