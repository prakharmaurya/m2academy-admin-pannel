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
// ---------------- Form Data axios configurations -----------
let formDataApiClient = axios.create({
  baseURL: baseUrl,
  headers: {
    'Content-Type': 'multipart/form-data',
    Authorization: `Bearer ${getCookie('token')}`,
    cid: '2786caca-8a58-4ca9-87be-c55996c4bc11',
  },
  timeout: 30000,
});

export function setFormDataAuthHeader(token) {
  formDataApiClient = axios.create({
    baseURL: baseUrl,
    headers: {
      'Content-Type': 'multipart/form-data',
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

// -------------- Chapters ----------------------

export const getChaptersBySubject = (id) => {
  return apiClient.get(`/chapters?subject_id=${id}`);
};

export const createChapterBySubject = (payload) => {
  return apiClient.post('/chapters', payload);
};
export const deleteChapter = (id) => {
  return apiClient.delete(`/chapters/${id}`);
};

// -------------- Contents ----------------------

export const getContentByChapter = (id) => {
  return apiClient.get(`/contents?chapter_id=${id}`);
};

export const uploadContentByChapter = (payload) => {
  return formDataApiClient.post('/contents', payload);
};
export const deleteContent = (id) => {
  return apiClient.delete(`/contents/${id}`);
};

export default apiClient;
