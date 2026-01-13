'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import api from '@/lib/api';
import { Recipe } from '@/types/recipe';

export default function Home() {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [isLoadingRecipes, setIsLoadingRecipes] = useState(true);

  useEffect(() => {
    const fetchRecipes = async () => {
      try {
        const response = await api.get('/recipes/ranking');
        setRecipes((response.data.recipes || []).slice(0, 4));
      } catch (error) {
        console.error('レシピの取得に失敗しました', error);
      } finally {
        setIsLoadingRecipes(false);
      }
    };
    fetchRecipes();
  }, []);

  return (
    <div>
      {/* Hero Section - Orange */}
      <section className="bg-orange-500 text-white py-24 md:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
              料理の楽しさを、
              <br />
              オンラインで。
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-orange-100">
              プロの料理人から学べる
              <br className="md:hidden" />
              オンライン料理教室
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                href="/lessons"
                className="bg-white text-orange-500 px-8 py-4 rounded-full font-bold text-lg hover:bg-orange-50 transition text-center shadow-lg"
              >
                レッスンを探す
              </Link>
              <Link
                href="/register"
                className="border-2 border-white text-white px-8 py-4 rounded-full font-bold text-lg hover:bg-white hover:text-orange-500 transition text-center"
              >
                無料で始める
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section - Yellow Green */}
      <section className="bg-lime-400 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-gray-800">
            カテゴリから探す
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { name: '和食', icon: '🍱', category: 'japanese', color: 'bg-red-500' },
              { name: '洋食', icon: '🍝', category: 'western', color: 'bg-yellow-500' },
              { name: '中華', icon: '🥟', category: 'chinese', color: 'bg-orange-500' },
              { name: 'スイーツ', icon: '🍰', category: 'sweets', color: 'bg-pink-500' },
            ].map((item) => (
              <Link
                key={item.category}
                href={`/lessons?category=${item.category}`}
                className={`${item.color} text-white rounded-2xl p-8 text-center hover:scale-105 transition-transform shadow-lg`}
              >
                <div className="text-5xl mb-4">{item.icon}</div>
                <div className="font-bold text-xl">{item.name}</div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Recipe Ranking Section */}
      <section className="bg-gray-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-4 text-gray-800">
            人気レシピランキング
          </h2>
          <p className="text-center text-gray-600 mb-12">
            楽天レシピの人気ランキングをチェック
          </p>
          {isLoadingRecipes ? (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-green-500 border-t-transparent"></div>
            </div>
          ) : recipes.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {recipes.map((recipe) => (
                <a
                  key={recipe.recipeId}
                  href={recipe.recipeUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-gray-50 rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition group"
                >
                  <div className="relative h-48">
                    <img
                      src={recipe.foodImageUrl}
                      alt={recipe.recipeTitle}
                      className="w-full h-full object-cover group-hover:scale-105 transition"
                    />
                    <div className="absolute top-2 left-2 bg-green-600 text-white text-xs font-bold px-2 py-1 rounded">
                      {recipe.rank}位
                    </div>
                  </div>
                  <div className="p-4">
                    <h3 className="font-bold text-gray-800 line-clamp-2 mb-2">
                      {recipe.recipeTitle}
                    </h3>
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <span>{recipe.recipeIndication}</span>
                      <span>•</span>
                      <span>{recipe.recipeCost}</span>
                    </div>
                  </div>
                </a>
              ))}
            </div>
          ) : null}
          <div className="text-center mt-8">
            <Link
              href="/recipes"
              className="inline-block bg-green-600 text-white px-8 py-3 rounded-full font-bold hover:bg-green-700 transition"
            >
              もっと見る
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section - White */}
      <section className="bg-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-4 text-gray-800">
            Cooking Labの特徴
          </h2>
          <p className="text-center text-gray-600 mb-12">
            初心者から上級者まで、あなたに合ったレッスンが見つかります
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center p-6">
              <div className="w-24 h-24 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-5xl">👨‍🍳</span>
              </div>
              <h3 className="text-xl font-bold mb-3 text-gray-800">プロの講師陣</h3>
              <p className="text-gray-600">
                経験豊富なプロの料理人が
                <br />
                丁寧に指導します
              </p>
            </div>
            <div className="text-center p-6">
              <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-5xl">📱</span>
              </div>
              <h3 className="text-xl font-bold mb-3 text-gray-800">いつでもどこでも</h3>
              <p className="text-gray-600">
                スマホ・PCから
                <br />
                好きな時間に参加できます
              </p>
            </div>
            <div className="text-center p-6">
              <div className="w-24 h-24 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-5xl">🎫</span>
              </div>
              <h3 className="text-xl font-bold mb-3 text-gray-800">チケット制</h3>
              <p className="text-gray-600">
                お得なチケットで
                <br />
                好きなレッスンを自由に受講
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How it works Section - Tomato Red */}
      <section className="bg-red-500 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
            ご利用の流れ
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-20 h-20 bg-white text-red-500 rounded-full flex items-center justify-center mx-auto mb-4 text-3xl font-bold shadow-lg">
                1
              </div>
              <h3 className="text-xl font-bold mb-2">無料登録</h3>
              <p className="text-red-100">
                メールアドレスで
                <br />
                簡単登録
              </p>
            </div>
            <div className="text-center">
              <div className="w-20 h-20 bg-white text-red-500 rounded-full flex items-center justify-center mx-auto mb-4 text-3xl font-bold shadow-lg">
                2
              </div>
              <h3 className="text-xl font-bold mb-2">チケット購入</h3>
              <p className="text-red-100">
                1回券〜10回券から
                <br />
                選べます
              </p>
            </div>
            <div className="text-center">
              <div className="w-20 h-20 bg-white text-red-500 rounded-full flex items-center justify-center mx-auto mb-4 text-3xl font-bold shadow-lg">
                3
              </div>
              <h3 className="text-xl font-bold mb-2">レッスン予約</h3>
              <p className="text-red-100">
                好きなレッスンを
                <br />
                予約して参加
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section - Green */}
      <section className="bg-green-600 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            今すぐ始めよう
          </h2>
          <p className="text-xl text-green-100 mb-8">
            無料登録で、すべてのレッスンをチェックできます
          </p>
          <Link
            href="/register"
            className="inline-block bg-white text-green-600 px-10 py-4 rounded-full font-bold text-lg hover:bg-green-50 transition shadow-lg"
          >
            無料で登録する
          </Link>
        </div>
      </section>
    </div>
  );
}
