import axios, { AxiosError, AxiosProgressEvent } from 'axios';

type OnUploadProgress = (progress: AxiosProgressEvent) => void;

class Request {
  static BASE_URL: string = import.meta.env.VITE_BASE_URL || 'no-baseurl-found';

  static postFileBinary(data: FormData, onProgress: OnUploadProgress) {
    axiosInstance.post(`${this.BASE_URL}/upload`, data, {
      onUploadProgress: onProgress
    });
  }

  static getFileBinary(uuid: string, onProgress: OnUploadProgress) {
    axiosInstance.get(`${this.BASE_URL}/file/${uuid}`, {
      onDownloadProgress: onProgress
    });
  }

  static getFilesMeta(uuids: string[]) {
    axiosInstance.get(`${this.BASE_URL}/files/meta`, { params: { uuids } });
  }
}

const axiosInstance = axios.create({ baseURL: Request.BASE_URL });

axiosInstance.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    const err = error?.response?.data || {
      message: 'Something went wrong',
      statusCode: 500
    };
    Promise.reject(err);
  }
);

export default Request;
