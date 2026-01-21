'use client';

import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';

export default function AboutPage() {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-stone-50">
      {/* Hero */}
      <section className="bg-gradient-to-br from-amber-50 via-stone-50 to-emerald-50 py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link href="/" className="inline-flex items-center text-stone-600 hover:text-emerald-700 mb-6 transition">
            <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            トップに戻る
          </Link>
          <p className="text-emerald-700 font-medium mb-2">About Us</p>
          <h1 className="text-3xl md:text-5xl font-bold text-stone-800 mb-6">
            おうち<span className="text-emerald-700">シェフ</span>とは
          </h1>
          <p className="text-xl text-stone-600 max-w-3xl leading-relaxed">
            おうちシェフは、プロの料理人から直接学べるオンライン料理教室です。
            自宅のキッチンで、本格的な料理のテクニックを身につけましょう。
          </p>
        </div>
      </section>

      {/* Mission */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-2xl border border-stone-100 p-8 md:p-12">
            <h2 className="text-2xl md:text-3xl font-bold text-stone-800 mb-6 text-center">
              私たちのミッション
            </h2>
            <p className="text-lg text-stone-600 text-center max-w-3xl mx-auto leading-relaxed">
              「毎日の食卓を、もっと豊かに。」<br />
              料理を通じて、家族との時間を特別なものに変えていく。
              それがおうちシェフの願いです。
            </p>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <p className="text-emerald-700 font-medium mb-2">Features</p>
            <h2 className="text-2xl md:text-3xl font-bold text-stone-800">
              おうちシェフの特徴
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-gradient-to-br from-amber-50 to-stone-50 rounded-2xl p-8">
              <div className="w-14 h-14 bg-amber-100 rounded-xl flex items-center justify-center mb-6">
                <svg className="w-7 h-7 text-amber-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-stone-800 mb-3">
                プロの技を自宅で
              </h3>
              <p className="text-stone-600 leading-relaxed">
                現役のプロ料理人が直接指導。レストランで提供される本格的な料理のコツを、ご自宅のキッチンで学べます。
              </p>
            </div>

            <div className="bg-gradient-to-br from-emerald-50 to-stone-50 rounded-2xl p-8">
              <div className="w-14 h-14 bg-emerald-100 rounded-xl flex items-center justify-center mb-6">
                <svg className="w-7 h-7 text-emerald-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-stone-800 mb-3">
                少人数制レッスン
              </h3>
              <p className="text-stone-600 leading-relaxed">
                各クラスは少人数制で開催。講師との距離が近く、質問もしやすい環境で、確実にスキルアップできます。
              </p>
            </div>

            <div className="bg-gradient-to-br from-sky-50 to-stone-50 rounded-2xl p-8">
              <div className="w-14 h-14 bg-sky-100 rounded-xl flex items-center justify-center mb-6">
                <svg className="w-7 h-7 text-sky-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-stone-800 mb-3">
                オンラインで参加
              </h3>
              <p className="text-stone-600 leading-relaxed">
                インターネット環境があればどこからでも参加可能。通学の手間なく、お好きな時間にレッスンを受けられます。
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <p className="text-emerald-700 font-medium mb-2">How it works</p>
            <h2 className="text-2xl md:text-3xl font-bold text-stone-800">
              ご利用の流れ
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[
              { step: '01', title: '会員登録', desc: '無料でアカウントを作成します' },
              { step: '02', title: 'チケット購入', desc: 'お好きなプランのチケットを購入' },
              { step: '03', title: 'レッスン予約', desc: '参加したいレッスンを選んで予約' },
              { step: '04', title: 'オンラインで参加', desc: '当日はZoomなどで参加' },
            ].map((item) => (
              <div key={item.step} className="bg-white rounded-2xl border border-stone-100 p-6 text-center">
                <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-emerald-700 font-bold">{item.step}</span>
                </div>
                <h3 className="font-bold text-stone-800 mb-2">{item.title}</h3>
                <p className="text-sm text-stone-600">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <p className="text-emerald-700 font-medium mb-2">Categories</p>
            <h2 className="text-2xl md:text-3xl font-bold text-stone-800">
              学べるジャンル
            </h2>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { name: '和食', color: 'amber', desc: '伝統的な日本料理' },
              { name: '洋食', color: 'orange', desc: 'フレンチ・イタリアンなど' },
              { name: '中華', color: 'red', desc: '本格中華料理' },
              { name: 'スイーツ', color: 'pink', desc: 'お菓子・デザート' },
            ].map((category) => (
              <div
                key={category.name}
                className={`bg-${category.color}-50 rounded-2xl p-6 text-center border border-${category.color}-100`}
              >
                <h3 className={`text-lg font-bold text-${category.color}-800 mb-1`}>
                  {category.name}
                </h3>
                <p className={`text-sm text-${category.color}-600`}>
                  {category.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-br from-emerald-700 to-emerald-800 rounded-2xl p-8 md:p-12 text-center">
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
              あなたも今日から始めませんか？
            </h2>
            <p className="text-emerald-100 mb-8 max-w-2xl mx-auto">
              おうちシェフで、プロの料理人から直接学ぶ楽しさを体験してください。
              初心者の方も大歓迎です。
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              {user ? (
                <>
                  <Link
                    href="/lessons"
                    className="inline-block bg-white text-emerald-700 px-8 py-4 rounded-xl font-bold hover:bg-emerald-50 transition"
                  >
                    レッスンを探す
                  </Link>
                  <Link
                    href="/mypage"
                    className="inline-block bg-emerald-600 text-white px-8 py-4 rounded-xl font-bold hover:bg-emerald-500 transition border border-emerald-500"
                  >
                    マイページへ
                  </Link>
                </>
              ) : (
                <>
                  <Link
                    href="/register"
                    className="inline-block bg-white text-emerald-700 px-8 py-4 rounded-xl font-bold hover:bg-emerald-50 transition"
                  >
                    無料会員登録
                  </Link>
                  <Link
                    href="/lessons"
                    className="inline-block bg-emerald-600 text-white px-8 py-4 rounded-xl font-bold hover:bg-emerald-500 transition border border-emerald-500"
                  >
                    レッスンを見る
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
