import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo & Description */}
          <div className="md:col-span-2">
            <Link href="/" className="flex items-center space-x-2 mb-4">
              <span className="text-2xl">🍳</span>
              <span className="text-xl font-bold">
                <span className="text-orange-400">Cooking</span>
                <span className="text-green-400">Lab</span>
              </span>
            </Link>
            <p className="text-gray-400 text-sm">
              プロの料理人から学べるオンライン料理教室。
              <br />
              初心者から上級者まで、楽しく料理を学べます。
            </p>
          </div>

          {/* Links */}
          <div>
            <h4 className="font-bold mb-4">サービス</h4>
            <ul className="space-y-2 text-gray-400 text-sm">
              <li>
                <Link href="/lessons" className="hover:text-white transition">
                  レッスン一覧
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-white transition">
                  Cooking Labとは
                </Link>
              </li>
              <li>
                <Link href="/register" className="hover:text-white transition">
                  無料登録
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-bold mb-4">お問い合わせ</h4>
            <p className="text-gray-400 text-sm">
              support@cookinglab.example.com
            </p>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-10 pt-8 text-center text-gray-500 text-sm">
          © {new Date().getFullYear()} Cooking Lab. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
