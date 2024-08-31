import axios, { AxiosError, AxiosProgressEvent } from 'axios';

export const BASE_URL: string =
  import.meta.env.VITE_BASE_URL || 'no-baseurl-found';

const axiosInstance = axios.create({ baseURL: BASE_URL });

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

type OnUploadProgress = (progress: AxiosProgressEvent) => void;

class Request {
  static postFileBinary(data: FormData, onProgress: OnUploadProgress) {
    axios.post(`${BASE_URL}/upload`, data, {
      onUploadProgress: onProgress
    });
  }
  static getFileBinary(uuid: string, onProgress: OnUploadProgress) {
    axios.get(`${BASE_URL}/file/${uuid}`, {
      onDownloadProgress: onProgress
    });
  }
  static getFilesMeta(uuids: string[]) {
    axios.get(`${BASE_URL}/files/meta`, { params: { uuids } });
  }
}

export default Request;
