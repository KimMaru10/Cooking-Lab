import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-stone-800 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo & Description */}
          <div className="md:col-span-2">
            <Link href="/" className="flex items-center mb-4">
              <span className="text-xl font-bold text-white">
                おうち<span className="text-emerald-400">シェフ</span>
              </span>
            </Link>
            <p className="text-stone-400 text-sm leading-relaxed">
              プロと一緒に、おうちで料理しよう。
              <br />
              自宅のキッチンから参加できるオンライン料理教室です。
            </p>
          </div>

          {/* Links */}
          <div>
            <h4 className="font-bold mb-4 text-stone-200">サービス</h4>
            <ul className="space-y-2 text-stone-400 text-sm">
              <li>
                <Link href="/lessons" className="hover:text-emerald-400 transition">
                  レッスン一覧
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-emerald-400 transition">
                  おうちシェフとは
                </Link>
              </li>
              <li>
                <Link href="/register" className="hover:text-emerald-400 transition">
                  無料登録
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-bold mb-4 text-stone-200">お問い合わせ</h4>
            <p className="text-stone-400 text-sm">
              support@cookinglab.example.com
            </p>
          </div>
        </div>

        <div className="border-t border-stone-700 mt-10 pt-8 text-center text-stone-500 text-sm">
          © {new Date().getFullYear()} おうちシェフ
        </div>
      </div>
    </footer>
  );
}
