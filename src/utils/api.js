import axios from 'axios';
import { getCookie } from './cookieConfig';

const baseUrl = 'https://api.m2academy.in';

const apiClient = axios.create({
  baseURL: baseUrl,
  headers: {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${getCookie('token')}`,
    cid: '2786caca-8a58-4ca9-87be-c55996c4bc11',
  },
  timeout: 30000,
});

export function setAuthHeader(token) {
  apiClient.defaults.headers.common['Authorization'] = `Bearer ${token}`;
}

export default apiClient;
