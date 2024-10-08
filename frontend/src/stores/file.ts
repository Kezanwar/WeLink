import { create } from 'zustand';
import { FileMeta } from './links';
import formatDate from '@app/util/format-date';

interface FileStore {
  file?: File;
  setFile: (str: File) => void;

  //processing
  base64: string;
  isProcessing: boolean;
  processingProgress: number;
  processError: boolean;
  processSuccess: boolean;
  onProcessAbort: () => void;
  onProcessSuccess: (base64: string) => void;
  onProcessError: () => void;
  onProcessingProgressChange: (progress: number) => void;
  setIsProcessing: (bool: boolean) => void;

  //uploading
  showUploadModal: boolean;
  isUploading: boolean;
  uploadProgress: number;
  fileUUID?: string;
  fileExpiry?: string;
  uploadSuccess: boolean;
  uploadError: string | undefined;
  closeUploadModal: () => void;
  onStartUpload: () => void;
  onUploadSuccess: (fileMeta: FileMeta) => void;
  onUploadError: (msg: string) => void;
  onUploadProgressChange: (progress: number) => void;
  onUploadIntervalIncrement: () => void;
}

const useFileStore = create<FileStore>()((set, get) => ({
  file: undefined,
  setFile: (file) => set(() => ({ file: file })),

  //processing
  base64: '',
  isProcessing: false,
  processingProgress: 0,
  processError: false,
  processSuccess: false,
  onProcessAbort: () => {
    set(() => ({
      file: undefined,
      base64: '',
      processingProgress: 0,
      isProcessing: false,
      processSuccess: false,
      processError: false
    }));
  },
  onProcessSuccess: (base64) => {
    set(() => ({
      base64: base64,
      isProcessing: false,
      processSuccess: true,
      processError: false
    }));
  },
  onProcessError: () => {
    set(() => ({
      file: undefined,
      base64: '',
      processingProgress: 0,
      isProcessing: false,
      processSuccess: false,
      processError: true
    }));
  },

  onProcessingProgressChange: (progress) =>
    set(() => ({ processingProgress: progress })),
  setIsProcessing: (boolean) => set(() => ({ isProcessing: boolean })),

  //uploading

  showUploadModal: false,
  isUploading: false,
  uploadProgress: 0,
  uploadSuccess: false,
  uploadError: undefined,
  fileUUID: undefined,
  fileExpiry: undefined,
  closeUploadModal: () => {
    if (get().isUploading) {
      return;
    }
    set(() => ({
      showUploadModal: false,
      isUploading: false,
      uploadProgress: 0,
      uploadSuccess: false,
      uploadError: undefined,
      fileUUID: undefined
    }));
  },
  onStartUpload: () => {
    set(() => ({ showUploadModal: true, isUploading: true }));
  },
  onUploadError: (msg) => {
    set(() => ({ uploadError: msg, isUploading: false }));
  },
  onUploadProgressChange: (p) => {
    set(() => ({ uploadProgress: p }));
  },
  onUploadIntervalIncrement: () => {
    set(() => ({ uploadProgress: Math.min(get().uploadProgress + 1, 99) }));
  },
  onUploadSuccess: (resp) => {
    set(() => ({
      fileUUID: resp.uuid,
      fileExpiry: formatDate(resp.expires),
      uploadSuccess: true,
      isUploading: false
    }));
  }
}));

export default useFileStore;
