import axios from 'axios';

const apiURL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';
// apiURLから/apiを除いたベースURL（sanctum/csrf-cookie用）
const baseURL = apiURL.replace(/\/api$/, '');

const api = axios.create({
  baseURL: apiURL,
  withCredentials: true,
  withXSRFToken: true,
  xsrfCookieName: 'XSRF-TOKEN',
  xsrfHeaderName: 'X-XSRF-TOKEN',
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

// CSRF Cookieを取得（Sanctum SPA認証）
export const getCsrfCookie = async () => {
  await axios.get(`${baseURL}/sanctum/csrf-cookie`, {
    withCredentials: true,
  });
};

// 認証エンドポイント（401でリダイレクト不要）
const authEndpoints = ['/auth/me', '/auth/login', '/auth/register', '/auth/logout'];

// レスポンスインターセプター（401エラー時にログインページへリダイレクト）
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const requestUrl = error.config?.url || '';
    const isAuthEndpoint = authEndpoints.some((endpoint) =>
      requestUrl.includes(endpoint)
    );

    // 認証エンドポイント以外で401エラーの場合はログインページへ
    if (error.response?.status === 401 && !isAuthEndpoint) {
      if (typeof window !== 'undefined') {
        window.location.href = '/login';
      }
    }

    return Promise.reject(error);
  }
);

export default api;
