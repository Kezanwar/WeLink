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

  static BASE_URL: string = import.meta.env.VITE_BASE_URL || 'no-baseurl-found';

  static postFileBinary(data: FormData, onProgress: OnUploadProgress) {
    this.axios.post(`${this.BASE_URL}/upload`, data, {
      onUploadProgress: onProgress
    });
  }

  static getFileBinary(uuid: string, onProgress: OnUploadProgress) {
    this.axios.get(`${this.BASE_URL}/file/${uuid}`, {
      onDownloadProgress: onProgress
    });
  }

  static getFilesMeta(uuids: string[]) {
    this.axios.get(`${this.BASE_URL}/files/meta`, { params: { uuids } });
  }
}

export default Request;
