import { ChangeEvent, FC, useState } from 'react';
import { Button, Input, useDisclosure } from '@nextui-org/react';
import { usePoster } from '../../store/usePoster.ts';
import { ModalPosterCreation } from '../modal/ModalPosterCreation.tsx';
import { shallow } from 'zustand/shallow';
import { SwitchPoster } from '../SwitchPoster.tsx';
import { useGatedPoster } from '../../store/useGatedPoster.ts';

export const PosterMenu: FC = () => {
    const [filter, setFilter] = useState('');
    const { isOpen, onOpen, onOpenChange } = useDisclosure();
    const filterEvents = usePoster((state) => state.filterEvents, shallow);
    const filterGatedEvents = useGatedPoster((state) => state.filterGatedEvents, shallow);

    const resetFilter = () => {
        setFilter('');
        resetEvents();
    };
    const resetEvents = () => {
        filterEvents('');
        filterGatedEvents('');
    };
    const handleSetFilter = (e: ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setFilter(value);
        if (!value.length) {
            resetEvents();
        }
    };
    const handlerFilterEvents = () => {
        filterEvents(filter);
        filterGatedEvents(filter);
    };

    return (
        <>
            <div className='flex items-center gap-5'>
                <Input
                    isClearable
                    value={filter}
                    label='filter'
                    variant='faded'
                    size='sm'
                    onClear={resetFilter}
                    onChange={handleSetFilter}
                />
                <Button onClick={handlerFilterEvents} color='primary' variant='solid' disabled={!filter} type='submit'>
                    Search
                </Button>
                <Button onClick={onOpen} color='primary' variant='flat'>
                    Post
                </Button>
                <SwitchPoster />
            </div>
            <ModalPosterCreation isOpen={isOpen} onOpenChange={onOpenChange} />
        </>
    );
};
