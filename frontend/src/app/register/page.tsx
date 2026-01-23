'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';

export default function RegisterPage() {
  const router = useRouter();
  const { register } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirmation, setPasswordConfirmation] = useState('');
  const [errors, setErrors] = useState<Record<string, string[]>>({});
  const [generalError, setGeneralError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    setGeneralError('');
    setIsLoading(true);

    try {
      await register(name, email, password, passwordConfirmation);
      router.push('/');
    } catch (err: unknown) {
      if (err && typeof err === 'object' && 'response' in err) {
        const axiosError = err as { response?: { data?: { message?: string; errors?: Record<string, string[]> } } };
        if (axiosError.response?.data?.errors) {
          setErrors(axiosError.response.data.errors);
        } else {
          setGeneralError(axiosError.response?.data?.message || '登録に失敗しました');
        }
      } else {
        setGeneralError('登録に失敗しました');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-amber-50 via-stone-50 to-emerald-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full">
        <div className="bg-white rounded-2xl border border-stone-100 p-8">
          <div className="text-center mb-8">
            <Link href="/" className="inline-block text-2xl font-bold text-stone-800 mb-2">
              おうち<span className="text-emerald-700">シェフ</span>
            </Link>
            <h1 className="text-xl font-bold text-stone-800">
              新規会員登録
            </h1>
            <p className="mt-2 text-sm text-stone-600">
              すでにアカウントをお持ちの方は{' '}
              <Link href="/login" className="font-medium text-emerald-700 hover:text-emerald-800">
                ログイン
              </Link>
            </p>
          </div>

          <form className="space-y-5" onSubmit={handleSubmit}>
            {generalError && (
              <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl text-sm">
                {generalError}
              </div>
            )}

            <div>
              <label htmlFor="name" className="block text-sm font-medium text-stone-700 mb-1">
                お名前
              </label>
              <input
                id="name"
                name="name"
                type="text"
                required
                className="appearance-none block w-full px-4 py-3 border border-stone-200 rounded-xl placeholder-stone-400 text-stone-800 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                placeholder="山田 太郎"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
              {errors.name && (
                <p className="mt-1 text-sm text-red-600">{errors.name[0]}</p>
              )}
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-stone-700 mb-1">
                メールアドレス
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="appearance-none block w-full px-4 py-3 border border-stone-200 rounded-xl placeholder-stone-400 text-stone-800 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                placeholder="example@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              {errors.email && (
                <p className="mt-1 text-sm text-red-600">{errors.email[0]}</p>
              )}
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-stone-700 mb-1">
                パスワード
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="new-password"
                required
                className="appearance-none block w-full px-4 py-3 border border-stone-200 rounded-xl placeholder-stone-400 text-stone-800 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                placeholder="8文字以上"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              {errors.password && (
                <p className="mt-1 text-sm text-red-600">{errors.password[0]}</p>
              )}
            </div>

            <div>
              <label htmlFor="password_confirmation" className="block text-sm font-medium text-stone-700 mb-1">
                パスワード（確認）
              </label>
              <input
                id="password_confirmation"
                name="password_confirmation"
                type="password"
                autoComplete="new-password"
                required
                className="appearance-none block w-full px-4 py-3 border border-stone-200 rounded-xl placeholder-stone-400 text-stone-800 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                placeholder="パスワードを再入力"
                value={passwordConfirmation}
                onChange={(e) => setPasswordConfirmation(e.target.value)}
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex justify-center py-3 px-4 border border-transparent rounded-xl text-white bg-emerald-700 hover:bg-emerald-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 font-medium transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? '登録中...' : '会員登録'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
