import axios from 'axios';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api',
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

// リフレッシュ不要なエンドポイント
const skipRefreshEndpoints = ['/auth/me', '/auth/refresh', '/auth/login', '/auth/register', '/auth/logout'];

// レスポンスインターセプター（401エラー時にリフレッシュ）
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    const requestUrl = originalRequest?.url || '';

    // リフレッシュ不要なエンドポイントはスキップ
    const shouldSkipRefresh = skipRefreshEndpoints.some((endpoint) =>
      requestUrl.includes(endpoint)
    );

    // 401エラーかつリトライしていない場合かつリフレッシュ対象の場合
    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      !shouldSkipRefresh
    ) {
      originalRequest._retry = true;

      try {
        // トークンリフレッシュ
        await api.post('/auth/refresh');
        // 元のリクエストを再実行
        return api(originalRequest);
      } catch {
        // リフレッシュ失敗時はログインページへ
        if (typeof window !== 'undefined') {
          window.location.href = '/login';
        }
        return Promise.reject(error);
      }
    }

    return Promise.reject(error);
  }
);

export default api;
