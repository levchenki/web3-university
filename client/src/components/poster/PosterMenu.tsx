import {FC} from "react";
import {Button, Input, useDisclosure} from "@nextui-org/react";
import {usePoster} from "../../store/usePoster.ts";
import {ModalPosterCreation} from "../modal/ModalPosterCreation.tsx";

export const PosterMenu: FC = () => {
    const {isOpen, onOpen, onOpenChange} = useDisclosure();
    const {tagFilter, setTagFilter, filterEvents} = usePoster()

    return <>
        <div className='flex items-center gap-5'>
            <Input
                value={tagFilter}
                onChange={e => setTagFilter(e.target.value)}
                label='filter'
                variant='faded'
                size='sm'/>
            <Button onClick={filterEvents}
                    color='primary'
                    variant='solid'
                    disabled={!tagFilter}
                    type='submit'>Search</Button>
            <Button onClick={onOpen}
                    color='primary'
                    variant='flat'>Post</Button>
        </div>
        <ModalPosterCreation isOpen={isOpen} onOpenChange={onOpenChange}/>
    </>
}