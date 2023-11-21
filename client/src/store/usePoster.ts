import {create} from "zustand";
import {PosterContract} from "../contracts/contracts.ts";
import {IPoster, TPostEvent} from "../types/posterInterfaces.tsx";
import {getAccount} from "../contracts/init.ts";
import {encryptKeccak256} from "../utils/utils.ts";


interface PosterStore {
    postEvents: IPoster[];
    tagFilter: string;
    filteredEvents: IPoster[];

    isLoading: boolean;
    isListening: boolean,

    createPoster: (tag: string, content: string) => Promise<void>;

    updateNewPostEvents: () => Promise<void>;
    filterEvents: () => void;
    listenEvents: () => Promise<void>;
    setTagFilter: (tagFilter: string) => void;
}

// todo validate messages and errors
export const usePoster = create<PosterStore>((set, get) => ({
    postEvents: [],
    tagFilter: '',
    filteredEvents: [],

    isListening: false,
    isLoading: false,

    createPoster: async (tag: string, content: string) => {
        set({isLoading: true})
        const account = await getAccount()

        if (!account) {
            throw new Error('No account')
        }

        await PosterContract.write.post([tag, content],
            {account: account})
            .catch(e => {
                console.log(e)
            }).finally(() => {
                set({isLoading: false})
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

        PosterContract.watchEvent.NewPost({}, {
            onLogs: (logs) => {
                logs.map(mapEventToPost).map(ne => {
                    alert(`New post! ${ne.content}`)
                })
                get().updateNewPostEvents()
            }
        })
        set({isListening: true})
    },

    filterEvents: () => {
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

}))

const mapEventToPost = (event: TPostEvent): IPoster => {
    return {
        user: event.args.user || '',
        tag: event.args.tag || '',
        content: event.args.content || '',
        transactionHash: event.transactionHash
    }
}
