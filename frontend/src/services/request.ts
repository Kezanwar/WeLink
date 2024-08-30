import axios, { AxiosError } from 'axios';

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

export default axiosInstance;
