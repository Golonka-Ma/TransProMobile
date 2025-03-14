import axios from 'axios';
import { getToken } from './auth';

const instance = axios.create({
  baseURL: 'http://192.168.1.19:8080',
});

instance.interceptors.request.use(async (config) => {
  const token = await getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

export default instance;
