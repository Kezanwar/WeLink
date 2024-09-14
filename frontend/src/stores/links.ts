import { isAfter } from 'date-fns';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type FileMeta = {
  uuid: string;
  size: number;
  formatted_size: string;
  name: string;
  type: string;
  expires: number;
};

//links are saved fileMetas in LS

interface LinksStore {
  files: FileMeta[];
  prune: () => void;
  add: (fileMeta: FileMeta) => void;
  exists: (name: string) => boolean;
}

const useLinksStore = create<LinksStore>()(
  persist(
    (set, get) => ({
      files: [],
      prune: () => {
        set((state) => {
          return {
            files: state.files.filter(
              (fileMeta) =>
                isAfter(new Date(fileMeta.expires * 1000), new Date()) // remove expired links
            )
          };
        });
      },
      add: (fileMeta) => {
        set((state) => {
          return { files: [fileMeta, ...state.files] };
        });
      },
      exists: (name) => {
        return !!get().files.find((f) => f.name === name);
      }
    }),
    {
      name: 'links'
    }
  )
);

export default useLinksStore;
