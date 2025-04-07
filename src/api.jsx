import axios from "axios";
const api = axios.create({
  baseURL: 'http://localhost:5173',
  headers: {
    'Content-Type': 'application/json'
  }
});

api.interceptors.response.use(
  response => {
    console.log('API Response:', response);
    return response;
  },
  error => {
    console.error('API Error:', error);
    return Promise.reject(error);
  }
);

export default api;
