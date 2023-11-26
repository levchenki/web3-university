import { FC, useEffect } from 'react';
import { usePoster } from '../../store/usePoster.ts';
import { PosterCard } from './PosterCard.tsx';
import { shallow } from 'zustand/shallow';
import { toast } from 'react-toastify';
import { useSwitchPoster } from '../../store/useSwitchPoster.ts';
import { useGatedPoster } from '../../store/useGatedPoster.ts';

export const PostersList: FC = () => {
    const mode = useSwitchPoster((state) => state.mode);
    const { filteredEvents, updateNewPostEvents } = usePoster(
        (state) => ({
            filteredEvents: state.filteredEvents,
            updateNewPostEvents: state.updateNewPostEvents,
        }),
        shallow,
    );

    const { gatedFilteredEvents, updateNewGatedPostEvents } = useGatedPoster(
        (state) => ({
            gatedFilteredEvents: state.gatedFilteredEvents,
            updateNewGatedPostEvents: state.updateNewGatedPostEvents,
        }),
        shallow,
    );

    useEffect(() => {
        updateNewPostEvents().catch((e) => toast.error(e.message));
        updateNewGatedPostEvents().catch((e) => toast.error(e.message));
    }, [updateNewPostEvents, updateNewGatedPostEvents]);

    return (
        <div className='flex flex-col gap-5'>
            {mode === 'gated'
                ? gatedFilteredEvents.map((event) => <PosterCard key={event.transactionHash} {...event} />)
                : filteredEvents.map((event) => <PosterCard key={event.transactionHash} {...event} />)}
        </div>
    );
};
