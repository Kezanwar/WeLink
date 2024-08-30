import { useRef } from 'react';
import { create } from 'zustand';

interface FileStore {
  file?: File;
  base64: string;
  isUploading: boolean;
  uploadingProgress: number;
  uploadError: boolean;
  uploadSuccess: boolean;
  onAbort: () => void;
  onUploadSuccess: (base64: string) => void;
  onUploadError: () => void;
  setFile: (str: File) => void;
  updateProgress: (progress: number) => void;
  setIsUploading: (bool: boolean) => void;
}

const useFileStore = create<FileStore>()((set) => ({
  file: undefined,
  base64: '',
  isUploading: false,
  uploadingProgress: 0,
  uploadError: false,
  uploadSuccess: false,
  onAbort: () =>
    set(() => ({
      file: undefined,
      base64: '',
      uploadingProgress: 0,
      isUploading: false,
      uploadSuccess: false,
      uploadError: false
    })),
  onUploadSuccess: (base64) =>
    set(() => ({
      base64: base64,
      isUploading: false,
      uploadSuccess: true,
      uploadError: false
    })),
  onUploadError: () =>
    set(() => ({
      file: undefined,
      base64: '',
      uploadingProgress: 0,
      isUploading: false,
      uploadSuccess: false,
      uploadError: true
    })),
  setFile: (file) => set(() => ({ file: file })),
  updateProgress: (progress) => set(() => ({ uploadingProgress: progress })),
  setIsUploading: (boolean) => set(() => ({ isUploading: boolean }))
}));

export default useFileStore;

export const useProcessFile = () => {
  const {
    setFile,
    setIsUploading,
    updateProgress,
    onAbort,
    onUploadSuccess,
    onUploadError
  } = useFileStore();

  const readerRef = useRef<FileReader | null>(null);

  const abort = () => {
    onAbort();
    readerRef?.current?.abort();
  };

  const processFile = (file: File) => {
    abort();
    setFile(file);

    readerRef.current = new FileReader();

    readerRef.current.onloadend = () => {
      onUploadSuccess(readerRef?.current?.result as string);
    };

    readerRef.current.onprogress = (e) => {
      const percentage = Math.round((e.loaded * 100) / e.total);
      updateProgress(percentage);
    };

    readerRef.current.onerror = () => {
      onUploadError();
    };

    setIsUploading(true);
    readerRef.current?.readAsDataURL(file);
  };

  return { processFile, abort };
};
