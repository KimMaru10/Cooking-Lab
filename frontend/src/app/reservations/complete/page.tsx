'use client';

import Link from 'next/link';

export default function ReservationCompletePage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <section className="bg-green-600 text-white py-8">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Steps */}
          <div className="flex items-center justify-center mb-6">
            <div className="flex items-center opacity-50">
              <div className="w-8 h-8 border-2 border-white rounded-full flex items-center justify-center font-bold">
                1
              </div>
              <span className="ml-2 text-sm">選択</span>
            </div>
            <div className="w-12 h-0.5 bg-white mx-2"></div>
            <div className="flex items-center opacity-50">
              <div className="w-8 h-8 border-2 border-white rounded-full flex items-center justify-center font-bold">
                2
              </div>
              <span className="ml-2 text-sm">確認</span>
            </div>
            <div className="w-12 h-0.5 bg-white mx-2"></div>
            <div className="flex items-center">
              <div className="w-8 h-8 bg-white text-green-600 rounded-full flex items-center justify-center font-bold">
                3
              </div>
              <span className="ml-2 text-sm font-bold">完了</span>
            </div>
          </div>
          <h1 className="text-2xl md:text-3xl font-bold text-center">予約完了</h1>
        </div>
      </section>

      {/* Content */}
      <section className="py-12">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg
                className="w-10 h-10 text-green-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>

            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              予約が完了しました
            </h2>
            <p className="text-gray-600 mb-8">
              レッスンの予約が完了しました。<br />
              マイページから予約内容をご確認いただけます。
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/mypage"
                className="px-8 py-4 bg-orange-500 text-white rounded-full font-bold hover:bg-orange-600 transition"
              >
                マイページで確認
              </Link>
              <Link
                href="/lessons"
                className="px-8 py-4 border-2 border-gray-300 text-gray-700 rounded-full font-bold hover:bg-gray-50 transition"
              >
                他のレッスンを探す
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
