import {GatedPosterContract} from "../contracts/contracts.ts";
import {IPoster, TPostEvent} from "../types/posterInterfaces.tsx";
import {getAccount} from "../contracts/init.ts";
import {encryptKeccak256} from "../utils/utils.ts";
import {createWithEqualityFn} from "zustand/traditional";
import {toast} from "react-toastify";
import {createJSONStorage, persist} from "zustand/middleware";


interface GatedPosterStore {
    gatedPostEvents: IPoster[];
    gatedFilteredEvents: IPoster[];
    threshold: bigint;

    isGatedCreation: boolean;

    createGatedPoster: (tag: string, content: string) => Promise<void>;
    updateNewGatedPostEvents: () => Promise<void>;
    filterGatedEvents: (filter: string) => void;

    listenEvents: () => Promise<void>;

    setThreshold: () => void;
}


export const useGatedPoster = createWithEqualityFn<GatedPosterStore>()(
    persist((set, get) => ({
        gatedPostEvents: [],
        gatedFilteredEvents: [],
        threshold: 0n,

        isGatedCreation: false,

        createGatedPoster: async (content: string, tag: string) => {
            set({isGatedCreation: true})
            const account = await getAccount()

            if (!account) {
                throw new Error('No account')
            }

            await GatedPosterContract.write.post([content, tag],
                {account: account})
                .catch(e => {
                    throw e
                })
                .finally(() => {
                    set({isGatedCreation: false})
                })
        },

        updateNewGatedPostEvents: async () => {
            const posters = await GatedPosterContract.getEvents.NewPost({}, {fromBlock: 1n})
                .then(events => events.reverse())
                .then(events => events.map(mapEventToPost))

            set({
                gatedPostEvents: posters ? posters : [],
                gatedFilteredEvents: posters ? posters : []
            })
        },

        listenEvents: async () => {
            GatedPosterContract.watchEvent.NewPost({}, {
                onLogs: (logs) => {
                    logs.map(mapEventToPost).map(ne => {
                        toast.success(`New gated post from ${ne.user}`)
                        set({gatedPostEvents: [ne, ...get().gatedPostEvents]})
                    })
                    get().filterGatedEvents('')
                }
            })
        },

        filterGatedEvents: (filter: string) => {
            if (filter === '') {
                set({gatedFilteredEvents: get().gatedPostEvents})
                return
            }
            const encryptedTag = encryptKeccak256(filter)
            const filteredEvents = get().gatedPostEvents.filter(e => e.tag === encryptedTag)
            set({gatedFilteredEvents: filteredEvents})
        },

        setThreshold: (): void => {
            GatedPosterContract.read.threshold().then(threshold => {
                set({threshold})
            })
        },
    }), {
        name: 'gated-poster-storage',
        storage: createJSONStorage(() => localStorage),
        partialize: state => ({
            gatedPostEvents: state.gatedPostEvents,
            gatedFilteredEvents: state.gatedFilteredEvents,
            isGatedCreation: state.isGatedCreation,
        }),
        onRehydrateStorage: (state) => {
            state.setThreshold()
            state.listenEvents().catch(e => toast.error(e.message))
        },
    }))

const mapEventToPost = (event: TPostEvent): IPoster => {
    return {
        user: event.args.user || '',
        tag: event.args.tag || '',
        content: event.args.content || '',
        transactionHash: event.transactionHash
    }
}
