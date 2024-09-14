import { FileMeta } from '@app/stores/links';
import formatBytes from '@app/util/format-bytes';
import axios, { AxiosError, AxiosInstance, AxiosProgressEvent } from 'axios';

type ErrorObject = {
  message: string;
  statusCode: number;
};

type OnProgress = (progress: AxiosProgressEvent) => void;

export type SuccessfulFileUploadResponse = {
  uuid: string;
  expires: number;
};

class Request {
  static API_BASE_URL: string = import.meta.env.VITE_API_BASE_URL;

  static FE_BASE_URL: string = import.meta.env.VITE_FE_BASE_URL;

  static axios: AxiosInstance;

  static genericErrMsg = 'Something went wrong';

  static init() {
    this.axios = axios.create({
      baseURL: Request.API_BASE_URL,
      headers: {
        'Content-Type': 'application/json'
      }
    });

    this.axios.interceptors.response.use(
      (response) => response,
      (error: AxiosError) => {
        const err = error?.response?.data || {
          message: this.genericErrMsg,
          statusCode: 500
        };
        return Promise.reject(err);
      }
    );
  }

  static getFormDataFromFile = (file: File) => {
    const formData = new FormData();
    formData.append('formatted_size', formatBytes(file.size));
    formData.append('file', file);
    return formData;
  };

  static postFile(file: File, onProgress: OnProgress) {
    const formData = this.getFormDataFromFile(file);
    return this.axios.post<FileMeta>('/upload', formData, {
      onUploadProgress: onProgress,
      headers: { 'Content-Type': 'multipart/form-data' }
    });
  }

  static getFileBinary(uuid: string, onProgress: OnProgress) {
    return this.axios.get(`/file/download/${uuid}`, {
      onDownloadProgress: onProgress
    });
  }

  static getFilesMeta(uuids: string[]) {
    return this.axios.get('/files/meta', { params: { uuids } });
  }

  static getFileMeta(uuid: string) {
    return this.axios.get(`/files/meta/${uuid}`);
  }

  /*narrows unknown error to a useable error*/
  static errorHandler(
    error: unknown,
    onError: (errorObj: ErrorObject) => void
  ): void {
    const apiErr = error as ErrorObject;
    if (typeof error === 'string') {
      onError({ message: error || this.genericErrMsg, statusCode: 500 });
    } else if (apiErr?.message) {
      onError(apiErr);
    } else {
      onError({ message: this.genericErrMsg, statusCode: 500 });
    }
  }
}

export default Request;
