import { FC } from 'react';
import { PostersList } from '../components/poster/PostersList.tsx';
import { PosterMenu } from '../components/poster/PosterMenu.tsx';

export const Main: FC = () => {
    return (
        <main className='flex-grow flex flex-col items-center my-5 gap-5'>
            <PosterMenu />
            <PostersList />
        </main>
    );
};
