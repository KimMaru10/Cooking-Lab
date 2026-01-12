'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import api from '@/lib/api';
import { useAuth } from '@/contexts/AuthContext';

type Plan = {
  id: string;
  name: string;
  count: number;
  price: number;
  pricePerLesson: number;
  validDays: number;
  popular?: boolean;
};

const plans: Plan[] = [
  {
    id: 'single',
    name: '1回券',
    count: 1,
    price: 3000,
    pricePerLesson: 3000,
    validDays: 30,
  },
  {
    id: 'five',
    name: '5回券',
    count: 5,
    price: 13500,
    pricePerLesson: 2700,
    validDays: 90,
    popular: true,
  },
  {
    id: 'ten',
    name: '10回券',
    count: 10,
    price: 25000,
    pricePerLesson: 2500,
    validDays: 180,
  },
];

export default function TicketPurchasePage() {
  const router = useRouter();
  const { user, isLoading: authLoading } = useAuth();
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  const [isPurchasing, setIsPurchasing] = useState(false);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login');
    }
  }, [authLoading, user, router]);

  const handlePurchase = async () => {
    if (!selectedPlan) {
      alert('プランを選択してください');
      return;
    }

    setIsPurchasing(true);
    try {
      await api.post('/tickets', { plan: selectedPlan });
      alert('チケットを購入しました');
      router.push('/mypage');
    } catch (error: unknown) {
      const err = error as { response?: { data?: { message?: string } } };
      alert(err.response?.data?.message || '購入に失敗しました');
    } finally {
      setIsPurchasing(false);
    }
  };

  if (authLoading || (!user && !authLoading)) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-orange-500 border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <section className="bg-green-600 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link href="/mypage" className="inline-flex items-center text-white/80 hover:text-white mb-4">
            <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            マイページに戻る
          </Link>
          <h1 className="text-3xl md:text-4xl font-bold">チケット購入</h1>
          <p className="mt-2 text-green-100">お得なチケットでレッスンを受講しましょう</p>
        </div>
      </section>

      {/* Plans */}
      <section className="py-12">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {plans.map((plan) => (
              <div
                key={plan.id}
                onClick={() => setSelectedPlan(plan.id)}
                className={`relative bg-white rounded-2xl shadow-lg p-6 cursor-pointer transition-all ${
                  selectedPlan === plan.id
                    ? 'ring-4 ring-green-500 scale-105'
                    : 'hover:shadow-xl'
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <span className="bg-orange-500 text-white text-xs font-bold px-3 py-1 rounded-full">
                      人気
                    </span>
                  </div>
                )}

                <div className="text-center">
                  <h3 className="text-2xl font-bold text-gray-800 mb-2">{plan.name}</h3>
                  <div className="text-4xl font-bold text-green-600 mb-1">
                    ¥{plan.price.toLocaleString()}
                  </div>
                  <div className="text-sm text-gray-500 mb-4">
                    1回あたり ¥{plan.pricePerLesson.toLocaleString()}
                  </div>

                  <div className="border-t pt-4 space-y-2 text-sm text-gray-600">
                    <div className="flex justify-between">
                      <span>レッスン回数</span>
                      <span className="font-medium">{plan.count}回</span>
                    </div>
                    <div className="flex justify-between">
                      <span>有効期限</span>
                      <span className="font-medium">{plan.validDays}日間</span>
                    </div>
                  </div>

                  <div className="mt-4">
                    <div
                      className={`w-6 h-6 mx-auto rounded-full border-2 flex items-center justify-center ${
                        selectedPlan === plan.id
                          ? 'border-green-500 bg-green-500'
                          : 'border-gray-300'
                      }`}
                    >
                      {selectedPlan === plan.id && (
                        <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path
                            fillRule="evenodd"
                            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                            clipRule="evenodd"
                          />
                        </svg>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Purchase Button */}
          <div className="mt-12 text-center">
            <button
              onClick={handlePurchase}
              disabled={!selectedPlan || isPurchasing}
              className={`px-12 py-4 rounded-full text-lg font-bold transition ${
                selectedPlan && !isPurchasing
                  ? 'bg-green-600 text-white hover:bg-green-700'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
            >
              {isPurchasing ? '処理中...' : '購入する'}
            </button>
            <p className="mt-4 text-sm text-gray-500">
              ※ デモ版のため、実際の決済は行われません
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
