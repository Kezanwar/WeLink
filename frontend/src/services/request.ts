import axios, { AxiosError, AxiosInstance, AxiosProgressEvent } from 'axios';

type OnUploadProgress = (progress: AxiosProgressEvent) => void;

class Request {
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
    Object.entries(file).forEach(([key, item]) => {
      formData.append(key, item);
    });
    return formData;
  };

  static BASE_URL: string = import.meta.env.VITE_BASE_URL || 'no-baseurl-found';

  static postFile(file: File, onProgress: OnUploadProgress) {
    const formData = this.getFormDataFromFile(file);
    return this.axios.post(`${this.BASE_URL}/upload`, formData, {
      onUploadProgress: onProgress
    });
  }

  static getFileBinary(uuid: string, onProgress: OnUploadProgress) {
    return this.axios.get(`${this.BASE_URL}/file/${uuid}`, {
      onDownloadProgress: onProgress
    });
  }

  static getFilesMeta(uuids: string[]) {
    return this.axios.get(`${this.BASE_URL}/files/meta`, { params: { uuids } });
  }
}

export default Request;
