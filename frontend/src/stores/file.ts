import { SuccessfulFileUploadResponse } from '@app/services/request';
import { useRef } from 'react';
import { create } from 'zustand';

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
  fileUUID: string | undefined;
  fileExpiry: Date | undefined;
  uploadSuccess: boolean;
  uploadError: string | undefined;
  closeUploadModal: () => void;
  onStartUpload: () => void;
  onUploadSuccess: (response: SuccessfulFileUploadResponse) => void;
  onUploadError: (msg: string) => void;
  onUploadProgressChange: (progress: number) => void;
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
  onUploadSuccess: (resp) => {
    console.log(resp.uuid);
    set(() => ({
      fileUUID: resp.uuid,
      fileExpiry: new Date(resp.expires * 1000),
      uploadSuccess: true,
      isUploading: false
    }));
  }
}));

export default useFileStore;
