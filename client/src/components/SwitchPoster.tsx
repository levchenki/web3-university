import { FC } from 'react';
import { Tab, Tabs } from '@nextui-org/react';
import { useSwitchPoster } from '../store/useSwitchPoster.ts';
import { PosterMode } from '../types/interfaces.ts';

export const SwitchPoster: FC = () => {
    const { mode, setMode } = useSwitchPoster((state) => ({
        mode: state.mode,
        setMode: state.setMode,
    }));

    return (
        <Tabs
            color='primary'
            variant='solid'
            selectedKey={mode}
            onSelectionChange={(key) => setMode(key as PosterMode)}
        >
            <Tab key='free' title='Free' />
            <Tab key='gated' title='Gated' />
        </Tabs>
    );
};
