// src/service/api.js
import axios from 'axios';

/**
 * Axios 인스턴스 설정
 */
const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:8080',
  timeout: 5000,
});

// 요청 인터셉터: JWT 토큰 자동 추가 등 공통 로직
api.interceptors.request.use(
  config => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  error => Promise.reject(error)
);

export default api;