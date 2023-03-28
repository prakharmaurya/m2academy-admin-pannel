import axios from 'axios';
import { getCookie } from './cookieConfig';

const baseUrl = 'https://api.m2academy.in';

// ------------- Creating axios instance --------------
let apiClient = axios.create({
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
  apiClient = axios.create({
    baseURL: baseUrl,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
      cid: '2786caca-8a58-4ca9-87be-c55996c4bc11',
    },
    timeout: 30000,
  });
}

// ---------------- APIs Calls --------------------

// -------------- Board ----------------------
export const getBoards = () => {
  return apiClient.get('/boards');
};

export const createNewBoard = (payload) => {
  return apiClient.post('/boards', payload);
};

export const deleteBoard = (id) => {
  return apiClient.delete(`/boards/${id}`);
};

// -------------- Classess ----------------------

export const getClassessByBoard = (id) => {
  return apiClient.get(`/classes?board_id=${id}`);
};

export const createClassByBoard = (payload) => {
  return apiClient.post('/classes', payload);
};
export const deleteClass = (id) => {
  return apiClient.delete(`/classes/${id}`);
};
// -------------- Subjects ----------------------

export const getSubjectsByClass = (id) => {
  return apiClient.get(`/subjects?class_id=${id}`);
};

export const createSubjectByClass = (payload) => {
  return apiClient.post('/subjects', payload);
};
export const deleteSubject = (id) => {
  return apiClient.delete(`/subjects/${id}`);
};

export default apiClient;
