import {FC, useEffect} from "react";
import {usePoster} from "../../store/usePoster.ts";
import {PosterCard} from "./PosterCard.tsx";

export const PostersList: FC = () => {
    const {filteredEvents, updateNewPostEvents, listenEvents} = usePoster()

    useEffect(() => {
        updatePosts().catch(console.error)
        listenEvents().catch(console.error)
    }, []);

    const updatePosts = async () => {
        await updateNewPostEvents()
    }

    return <div className='flex flex-col gap-5'>
        {
            filteredEvents.map(event => (
                <PosterCard key={event.transactionHash} {...event}/>
            ))
        }
    </div>
}