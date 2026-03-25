import axios from 'axios'

const API = axios.create({
  baseURL: 'http://localhost:5000/api'
})

API.interceptors.request.use((req) => {
  const user = localStorage.getItem('user')
  if (user) {
    req.headers.Authorization = `Bearer ${JSON.parse(user).token}`
  }
  return req
})

export const registerUser = (data) => API.post('/auth/register', data)
export const loginUser = (data) => API.post('/auth/login', data)
export const getMyObjects = () => API.get('/objects/my')
export const uploadObject = (formData) => API.post('/objects/upload', formData)
export const saveCameraState = (id, data) => API.put(`/objects/${id}/camera`, data)