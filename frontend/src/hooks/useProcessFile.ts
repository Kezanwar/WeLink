import useFileStore from '@app/stores/file';
import { useRef } from 'react';

const useProcessFile = () => {
  const {
    setFile,
    setIsProcessing,
    onProcessingProgressChange,
    onProcessAbort,
    onProcessSuccess,
    onProcessError
  } = useFileStore();

  const readerRef = useRef<FileReader | null>(null);

  const abort = () => {
    onProcessAbort();
    readerRef?.current?.abort();
    readerRef.current = null;
  };

  const processFile = (file: File) => {
    abort();
    setFile(file);

    readerRef.current = new FileReader();

    readerRef.current.onloadend = () => {
      onProcessSuccess(readerRef?.current?.result as string);
    };

    readerRef.current.onprogress = (e) => {
      const percentage = Math.round((e.loaded * 100) / e.total);
      onProcessingProgressChange(percentage);
    };

    readerRef.current.onerror = () => {
      onProcessError();
    };

    setIsProcessing(true);
    readerRef.current?.readAsDataURL(file);
  };

  return { processFile, abort };
};

export default useProcessFile;
