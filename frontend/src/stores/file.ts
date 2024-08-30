import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface FileStore {
  file: string;
  setFile: (str: string) => void;
  clearFile: () => void;
}

const useFileStore = create<FileStore>()(
  persist(
    (set) => ({
      file: '',
      setFile: (string) => set(() => ({ file: string })),
      clearFile: () => set(() => ({ file: '' }))
    }),
    {
      name: 'file'
    }
  )
);

export default useFileStore;
