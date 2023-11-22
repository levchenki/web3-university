import {PosterContract} from "../contracts/contracts.ts";
import {IPoster, TPostEvent} from "../types/posterInterfaces.tsx";
import {getAccount} from "../contracts/init.ts";
import {encryptKeccak256} from "../utils/utils.ts";
import {createWithEqualityFn} from "zustand/traditional";
import {toast} from "react-toastify";
import {devtools} from "zustand/middleware";


interface PosterStore {
    postEvents: IPoster[];
    filteredEvents: IPoster[];
    tagFilter: string;

    isCreation: boolean;

    createPoster: (tag: string, content: string) => Promise<void>;
    updateNewPostEvents: () => Promise<void>;
    filterEvents: () => void;

    isListening: boolean,
    listenEvents: () => Promise<void>;

    setTagFilter: (tagFilter: string) => void;
}


export const usePoster = createWithEqualityFn<PosterStore>()(
    devtools((set, get) => ({
    postEvents: [],
    tagFilter: '',
    filteredEvents: [],

    isListening: false,
        isCreation: false,

    createPoster: async (tag: string, content: string) => {
        set({isCreation: true})
        const account = await getAccount()

        if (!account) {
            throw new Error('No account')
        }

        await PosterContract.write.post([tag, content],
            {account: account})
            .catch(e => {
                throw e
            })
            .finally(() => {
                set({isCreation: false})
            })
    },

    updateNewPostEvents: async () => {
        const posters = await PosterContract.getEvents.NewPost({}, {fromBlock: 1n})
            .then(events => events.reverse())
            .then(events => events.map(mapEventToPost))

        set({
            postEvents: posters ? posters : [],
            filteredEvents: posters ? posters : []
        })
    },

    listenEvents: async () => {
        if (get().isListening) {
            return
        }
        set({isListening: true})
        PosterContract.watchEvent.NewPost({}, {
            onLogs: (logs) => {
                logs.map(mapEventToPost).map(ne => {
                    toast.success(`New post from ${ne.user}`)
                    set({postEvents: [ne, ...get().postEvents]})
                })
                get().filterEvents()
            }
        })
    },

    filterEvents: () => {
        if (get().tagFilter === '') {
            set({filteredEvents: get().postEvents})
            return
        }
        const encryptedTag = encryptKeccak256(get().tagFilter)
        const filteredEvents = get().postEvents.filter(e => e.tag === encryptedTag)
        set({filteredEvents})
    },

    setTagFilter: (tagFilter: string) => {
        set({tagFilter});
        if (tagFilter === '') {
            set({filteredEvents: get().postEvents})
            return
        }
    }
    })))

const mapEventToPost = (event: TPostEvent): IPoster => {
    return {
        user: event.args.user || '',
        tag: event.args.tag || '',
        content: event.args.content || '',
        transactionHash: event.transactionHash
    }
}
