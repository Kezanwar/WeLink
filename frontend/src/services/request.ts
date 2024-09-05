import formatBytes from '@app/util/bytes';
import axios, { AxiosError, AxiosInstance, AxiosProgressEvent } from 'axios';

type OnProgress = (progress: AxiosProgressEvent) => void;

class Request {
  static BASE_URL: string = import.meta.env.VITE_BASE_URL;

  static axios: AxiosInstance;

  static init() {
    this.axios = axios.create({ baseURL: Request.BASE_URL });

    this.axios.interceptors.response.use(
      (response) => response,
      (error: AxiosError) => {
        const err = error?.response?.data || {
          message: 'Something went wrong',
          statusCode: 500
        };
        Promise.reject(err);
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
    return this.axios.post('/upload', formData, {
      onUploadProgress: onProgress,
      headers: { 'Content-Type': 'multipart/form-data' }
    });
  }

  static getFileBinary(uuid: string, onProgress: OnProgress) {
    return this.axios.get(`/file/${uuid}`, {
      onDownloadProgress: onProgress
    });
  }

  static getFilesMeta(uuids: string[]) {
    return this.axios.get(`/files/meta`, { params: { uuids } });
  }
}

export default Request;
