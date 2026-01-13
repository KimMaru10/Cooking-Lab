'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import api from '@/lib/api';
import { Recipe, RecipeCategory } from '@/types/recipe';

export default function RecipesPage() {
  const [categories, setCategories] = useState<RecipeCategory[]>([]);
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchCategories();
    fetchRecipes();
  }, []);

  useEffect(() => {
    fetchRecipes(selectedCategory);
  }, [selectedCategory]);

  const fetchCategories = async () => {
    try {
      const response = await api.get('/recipes/categories');
      setCategories(response.data.categories || []);
    } catch (error) {
      console.error('カテゴリの取得に失敗しました', error);
    }
  };

  const fetchRecipes = async (categoryId?: string) => {
    setIsLoading(true);
    try {
      const params = categoryId ? `?category_id=${categoryId}` : '';
      const response = await api.get(`/recipes/ranking${params}`);
      setRecipes(response.data.recipes || []);
    } catch (error) {
      console.error('レシピの取得に失敗しました', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <section className="bg-green-600 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link href="/" className="inline-flex items-center text-white/80 hover:text-white mb-4">
            <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            トップに戻る
          </Link>
          <h1 className="text-3xl md:text-4xl font-bold">人気レシピ</h1>
          <p className="mt-2 text-green-100">楽天レシピの人気ランキングをチェック</p>
        </div>
      </section>

      {/* Category Filter */}
      <section className="py-6 bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setSelectedCategory('')}
              className={`px-4 py-2 rounded-full text-sm font-medium transition ${
                selectedCategory === ''
                  ? 'bg-green-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              すべて
            </button>
            {categories.map((category) => (
              <button
                key={category.categoryId}
                onClick={() => setSelectedCategory(category.categoryId)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition ${
                  selectedCategory === category.categoryId
                    ? 'bg-green-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {category.categoryName}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Recipes Grid */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {isLoading ? (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-green-500 border-t-transparent"></div>
              <p className="mt-4 text-gray-600">読み込み中...</p>
            </div>
          ) : recipes.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500">レシピが見つかりませんでした</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {recipes.map((recipe) => (
                <a
                  key={recipe.recipeId}
                  href={recipe.recipeUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition group"
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
                    <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
                      <span>{recipe.recipeIndication}</span>
                      <span>•</span>
                      <span>{recipe.recipeCost}</span>
                    </div>
                    <div className="text-xs text-gray-400">
                      by {recipe.nickname}
                    </div>
                    <div className="mt-3 flex flex-wrap gap-1">
                      {recipe.recipeMaterial.slice(0, 3).map((material, index) => (
                        <span
                          key={index}
                          className="bg-gray-100 text-gray-600 text-xs px-2 py-0.5 rounded"
                        >
                          {material}
                        </span>
                      ))}
                      {recipe.recipeMaterial.length > 3 && (
                        <span className="text-xs text-gray-400">
                          +{recipe.recipeMaterial.length - 3}
                        </span>
                      )}
                    </div>
                  </div>
                </a>
              ))}
            </div>
          )}

          {/* Attribution */}
          <div className="mt-8 text-center text-sm text-gray-500">
            レシピデータは
            <a
              href="https://recipe.rakuten.co.jp/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-green-600 hover:underline ml-1"
            >
              楽天レシピ
            </a>
            より提供されています
          </div>
        </div>
      </section>
    </div>
  );
}
