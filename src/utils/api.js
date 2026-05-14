import axios from 'axios'
import { getCookie } from './cookieConfig'

// const baseUrl = 'http://192.168.1.38:5000'
const baseUrl = 'https://apiv2.m2academyedu.com'
// const baseUrl = 'https://api.m2academy.in';
// const cid = '2786caca-8a58-4ca9-87be-c55996c4bc11'; // inflection cid
const cid = 'c9492d75-0bb9-47e8-b412-718189704ffa' // meet cid

// ------------- Creating axios instance --------------
let apiClient = axios.create({
  baseURL: baseUrl,
  headers: {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${getCookie('token')}`,
    cid: cid,
  },
  timeout: 30000,
})

// ---------- setting up axios auth header -------------------
export function setAuthHeader(token) {
  apiClient = axios.create({
    baseURL: baseUrl,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
      cid: cid,
    },
    timeout: 30000,
  })
}
// ---------------- Form Data axios configurations -----------
let formDataApiClient = axios.create({
  baseURL: baseUrl,
  headers: {
    'Content-Type': 'multipart/form-data',
    Authorization: `Bearer ${getCookie('token')}`,
    cid: cid,
  },
  timeout: 60000,
})

export function setFormDataAuthHeader(token) {
  formDataApiClient = axios.create({
    baseURL: baseUrl,
    headers: {
      'Content-Type': 'multipart/form-data',
      Authorization: `Bearer ${token}`,
      cid: cid,
    },
    timeout: 60000,
  })
}
// ---------------- APIs Calls --------------------

// -------------- Board ----------------------
export const getAllCategory = () => {
  return apiClient.get('/categories')
}

export const createNewCategory = (payload) => {
  return apiClient.post('/categories', payload)
}

export const deleteACategory = (id) => {
  return apiClient.delete(`/categories/${id}`)
}

export const editACategory = (id, payload) => {
  return apiClient.patch(`/categories/${id}`, payload)
}
// --------------------- All Content Data ----------------
export const getAllContents = (id) => {
  return apiClient.get(`/categories/data?category_id=${id}`)
}
//  ------------- Yt Videos ---------------------
export const uploadYtVideos = (payload) => {
  return apiClient.post('/videos', payload)
}

export const deleteYtVideo = (id) => {
  return apiClient.delete(`/videos/${id}`)
}

//  ------------- Excercise ---------------------
export const uploadExcercises = (payload) => {
  return formDataApiClient.post('/excercises', payload)
}

export const editExcercises = (id, payload) => {
  return formDataApiClient.patch(`/excercises/${id}`, payload)
}

export const deleteExcercise = (id) => {
  return apiClient.delete(`/excercises/${id}`)
}
// -------------- Contents ----------------------

export const uploadContents = (payload) => {
  return formDataApiClient.post('/contents', payload)
}
export const deleteContent = (id) => {
  return apiClient.delete(`/contents/${id}`)
}

export const createCarousel = (payload) => {
  return formDataApiClient.post('/carousels', payload)
}
export const getACarousel = (name) => {
  return apiClient.get(`/carousels/${name}`)
}
export const removeACarousel = (id) => {
  return apiClient.delete(`/carousels/${id}`)
}

export default apiClient
