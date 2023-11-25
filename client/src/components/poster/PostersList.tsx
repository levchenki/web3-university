import {FC, useEffect} from "react";
import {usePoster} from "../../store/usePoster.ts";
import {PosterCard} from "./PosterCard.tsx";
import {shallow} from "zustand/shallow";
import {toast} from "react-toastify";

export const PostersList: FC = () => {
    const {filteredEvents, updateNewPostEvents, listenEvents} = usePoster(state => ({
        filteredEvents: state.filteredEvents,
        updateNewPostEvents: state.updateNewPostEvents,
        listenEvents: state.listenEvents,
    }), shallow)

    useEffect(() => {
        updateNewPostEvents().catch(e => toast.error(e.message))
    }, [updateNewPostEvents]);

    useEffect(() => {
        listenEvents().catch(e => toast.error(e.message))
    }, [listenEvents]);

    return <div className='flex flex-col gap-5'>
        {
            filteredEvents.map(event => (
                <PosterCard key={event.transactionHash} {...event}/>
            ))
        }
    </div>
}