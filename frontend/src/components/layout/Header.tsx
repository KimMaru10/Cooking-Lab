'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, isLoading, logout } = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await logout();
      router.push('/');
      router.refresh();
    } catch (error) {
      console.error('ログアウトに失敗しました', error);
      // エラーが発生してもユーザー状態をクリアしてリダイレクト
      router.push('/');
      router.refresh();
    }
  };

  return (
    <header className="bg-white/95 backdrop-blur-sm sticky top-0 z-50 border-b border-stone-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center">
            <span className="text-2xl font-bold text-stone-800">
              おうち<span className="text-emerald-700">シェフ</span>
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link
              href="/lessons"
              className="text-stone-600 hover:text-emerald-700 font-medium transition"
            >
              レッスン
            </Link>
            <Link
              href="/recipes"
              className="text-stone-600 hover:text-emerald-700 font-medium transition"
            >
              レシピ
            </Link>
            <Link
              href="/about"
              className="text-stone-600 hover:text-emerald-700 font-medium transition"
            >
              おうちシェフとは
            </Link>

            {isLoading ? (
              <span className="text-stone-400">...</span>
            ) : user ? (
              <>
                {user.role === 'staff' && (
                  <Link
                    href="/admin"
                    className="text-stone-600 hover:text-emerald-700 font-medium transition"
                  >
                    管理画面
                  </Link>
                )}
                {user.role === 'instructor' && (
                  <Link
                    href="/instructor"
                    className="text-stone-600 hover:text-emerald-700 font-medium transition"
                  >
                    講師管理
                  </Link>
                )}
                <Link
                  href="/mypage"
                  className="text-stone-600 hover:text-emerald-700 font-medium transition"
                >
                  マイページ
                </Link>
                <button
                  onClick={handleLogout}
                  className="text-stone-600 hover:text-emerald-700 font-medium transition"
                >
                  ログアウト
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  className="text-stone-600 hover:text-emerald-700 font-medium transition"
                >
                  ログイン
                </Link>
                <Link
                  href="/register"
                  className="bg-emerald-700 text-white px-6 py-2 rounded-xl hover:bg-emerald-800 font-medium transition"
                >
                  無料登録
                </Link>
              </>
            )}
          </nav>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              {isMenuOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <nav className="md:hidden pb-4 space-y-2 border-t border-stone-100 pt-4">
            <Link
              href="/lessons"
              className="block py-2 text-stone-600 hover:text-emerald-700"
            >
              レッスン
            </Link>
            <Link
              href="/recipes"
              className="block py-2 text-stone-600 hover:text-emerald-700"
            >
              レシピ
            </Link>
            <Link
              href="/about"
              className="block py-2 text-stone-600 hover:text-emerald-700"
            >
              おうちシェフとは
            </Link>

            {isLoading ? (
              <span className="block py-2 text-stone-400">...</span>
            ) : user ? (
              <>
                {user.role === 'staff' && (
                  <Link
                    href="/admin"
                    className="block py-2 text-stone-600 hover:text-emerald-700"
                  >
                    管理画面
                  </Link>
                )}
                {user.role === 'instructor' && (
                  <Link
                    href="/instructor"
                    className="block py-2 text-stone-600 hover:text-emerald-700"
                  >
                    講師管理
                  </Link>
                )}
                <Link
                  href="/mypage"
                  className="block py-2 text-stone-600 hover:text-emerald-700"
                >
                  マイページ
                </Link>
                <button
                  onClick={handleLogout}
                  className="block py-2 text-stone-600 hover:text-emerald-700 text-left w-full"
                >
                  ログアウト
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  className="block py-2 text-stone-600 hover:text-emerald-700"
                >
                  ログイン
                </Link>
                <Link
                  href="/register"
                  className="block py-2 text-emerald-700 font-medium"
                >
                  無料登録
                </Link>
              </>
            )}
          </nav>
        )}
      </div>
    </header>
  );
}
