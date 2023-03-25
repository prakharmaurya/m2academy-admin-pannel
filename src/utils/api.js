import axios from 'axios';
import { getCookie } from './cookieConfig';

const baseUrl = 'https://api.m2academy.in';

// ------------- Creating axios instance --------------
const apiClient = axios.create({
  baseURL: baseUrl,
  headers: {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${getCookie('token')}`,
    cid: '2786caca-8a58-4ca9-87be-c55996c4bc11',
  },
  timeout: 30000,
});

// ---------- setting up axios auth header -------------------
export function setAuthHeader(token) {
  apiClient.defaults.headers.common['Authorization'] = `Bearer ${token}`;
}

// ---------------- APIs Calls --------------------

export const getBoards = () => {
  return apiClient.get('/boards');
};

export default apiClient;
