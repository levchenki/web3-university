import {createJSONStorage, persist} from "zustand/middleware";
import {create} from "zustand";
import {PosterMode} from "../types/interfaces.ts";

// todo enum
interface SwitchPosterStore {
    mode: PosterMode;
    setMode: (selected: PosterMode) => void;
}


export const useSwitchPoster = create<SwitchPosterStore>()(
    persist((set) => ({
        mode: 'free',
        setMode: (selected: PosterMode) => {
            set({mode: selected})
        }
    }), {
        name: 'switchPoster',
        storage: createJSONStorage(() => localStorage),
    })
)