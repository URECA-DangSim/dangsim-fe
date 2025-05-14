// src/service/api.js
import axios from "axios";

const API_URL = process.env.REACT_APP_API_URL;
if (!API_URL) {
  throw new Error("REACT_APP_API_URL is not defined");
}

/**
 * Axios 인스턴스 설정
 */
const api = axios.create({
  baseURL: API_URL,
  timeout: 5000,
});

// 요청 인터셉터: 토큰이 있으면 헤더에 추가
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// 응답 인터셉터: 토큰 만료 시 재발급
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // 토큰 만료 에러이고, 재시도하지 않은 요청인 경우
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        // 리프레시 토큰으로 새로운 토큰 발급
        const refreshToken = localStorage.getItem("refreshToken");
        const res = await axios.post(
          `${API_URL}/api/auth/reissue`,
          {},
          {
            headers: {
              Authorization: `Bearer ${refreshToken}`,
            },
          }
        );

        // 새로운 토큰 저장
        const { accessToken } = res.data;
        localStorage.setItem("accessToken", accessToken);

        // 새로운 토큰으로 원래 요청 재시도
        originalRequest.headers.Authorization = `Bearer ${accessToken}`;
        return api(originalRequest);
      } catch (refreshError) {
        // 리프레시 토큰도 만료된 경우 로그아웃 처리
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        window.location.href = "/login";
        return Promise.reject(refreshError);
      }
    }

    // 401 에러 (인증 실패) 또는 403 에러 (권한 없음) 처리
    if (error.response?.status === 401 || error.response?.status === 403) {
      // 메인 페이지가 아닌 경우에만 리다이렉트
      if (window.location.pathname !== "/") {
        window.location.href = "/";
      }
      return Promise.reject(error);
    }

    return Promise.reject(error);
  }
);

export default api;
