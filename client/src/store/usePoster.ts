import { PosterContract } from '../contracts/contracts.ts';
import { IPoster, TPostEvent } from '../types/posterInterfaces.tsx';
import { getAccount } from '../contracts/init.ts';
import { encryptKeccak256 } from '../utils/utils.ts';
import { createWithEqualityFn } from 'zustand/traditional';
import { toast } from 'react-toastify';
import { persist } from 'zustand/middleware';

interface PosterStore {
    postEvents: IPoster[];
    filteredEvents: IPoster[];

    isCreation: boolean;

    createPoster: (tag: string, content: string) => Promise<void>;
    updateNewPostEvents: () => Promise<void>;
    filterEvents: (filter: string) => void;

    listenEvents: () => Promise<void>;
}

export const usePoster = createWithEqualityFn<PosterStore>()(
    persist(
        (set, get) => ({
            postEvents: [],
            filteredEvents: [],

            isCreation: false,

            createPoster: async (content: string, tag: string) => {
                set({ isCreation: true });
                const account = await getAccount();

                if (!account) {
                    throw new Error('No account');
                }

                await PosterContract.write
                    .post([content, tag], { account: account })
                    .catch((e) => {
                        throw e;
                    })
                    .finally(() => {
                        set({ isCreation: false });
                    });
            },

            updateNewPostEvents: async () => {
                const posters = await PosterContract.getEvents
                    .NewPost({}, { fromBlock: 1n })
                    .then((events) => events.reverse())
                    .then((events) => events.map(mapEventToPost));

                set({
                    postEvents: posters ? posters : [],
                    filteredEvents: posters ? posters : [],
                });
            },

            listenEvents: async () => {
                PosterContract.watchEvent.NewPost(
                    {},
                    {
                        onLogs: (logs) => {
                            logs.map(mapEventToPost).map((ne) => {
                                toast.success(`New post from ${ne.user}`);
                                set({ postEvents: [ne, ...get().postEvents] });
                            });
                            get().filterEvents('');
                        },
                    },
                );
            },

            filterEvents: (filter: string) => {
                if (filter === '') {
                    set({ filteredEvents: get().postEvents });
                    return;
                }
                const encryptedTag = encryptKeccak256(filter);
                const filteredEvents = get().postEvents.filter((e) => e.tag === encryptedTag);
                set({ filteredEvents });
            },
        }),
        {
            name: 'poster-storage',
            onRehydrateStorage: (state) => {
                state.listenEvents().catch((e) => toast.error(e.message));
            },
        },
    ),
);

const mapEventToPost = (event: TPostEvent): IPoster => {
    return {
        user: event.args.user || '',
        tag: event.args.tag || '',
        content: event.args.content || '',
        transactionHash: event.transactionHash,
    };
};
