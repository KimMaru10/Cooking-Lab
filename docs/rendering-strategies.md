# Next.js レンダリング方式比較

## 概要

Next.js 14 App Routerで使用できる4つのレンダリング方式を比較し、Cooking Labの各ページに最適な方式を選定する。

## レンダリング方式一覧

| 方式 | 正式名称 | レンダリングタイミング | キャッシュ |
|------|----------|----------------------|-----------|
| CSR | Client-Side Rendering | ブラウザ | なし |
| SSR | Server-Side Rendering | リクエスト時 | なし |
| SSG | Static Site Generation | ビルド時 | 永続 |
| ISR | Incremental Static Regeneration | ビルド時 + 再生成 | 時限 |

## 各方式の詳細

### CSR (Client-Side Rendering)

```tsx
'use client';

export default function Page() {
  const [data, setData] = useState(null);

  useEffect(() => {
    fetch('/api/data').then(res => setData(res.json()));
  }, []);

  return <div>{data}</div>;
}
```

**特徴**
- ブラウザでJavaScriptを実行してレンダリング
- 初回表示が遅い（白い画面が表示される）
- SEOに不利（検索エンジンがコンテンツを認識しにくい）
- ユーザー固有のデータ表示に適している

**適したページ**
- マイページ
- ダッシュボード
- 認証が必要なページ

### SSR (Server-Side Rendering)

```tsx
// App Router: デフォルトでSSR
// cache: 'no-store' でキャッシュを無効化
async function getData() {
  const res = await fetch('https://api.example.com/data', {
    cache: 'no-store'
  });
  return res.json();
}

export default async function Page() {
  const data = await getData();
  return <div>{data}</div>;
}
```

**特徴**
- リクエストごとにサーバーでHTMLを生成
- 常に最新データを表示
- サーバー負荷が高い
- TTFB（Time To First Byte）が遅くなる可能性

**適したページ**
- 検索結果ページ
- リアルタイム性が重要なページ

### SSG (Static Site Generation)

```tsx
// App Router: fetch のデフォルトはキャッシュ有効
async function getData() {
  const res = await fetch('https://api.example.com/data');
  return res.json();
}

export default async function Page() {
  const data = await getData();
  return <div>{data}</div>;
}
```

**特徴**
- ビルド時にHTMLを生成
- 表示が非常に高速
- CDNでキャッシュ可能
- 更新にはビルドが必要

**適したページ**
- トップページ
- Aboutページ
- 利用規約

### ISR (Incremental Static Regeneration)

```tsx
async function getData() {
  const res = await fetch('https://api.example.com/data', {
    next: { revalidate: 60 } // 60秒ごとに再生成
  });
  return res.json();
}

export default async function Page() {
  const data = await getData();
  return <div>{data}</div>;
}
```

**特徴**
- SSGの利点を維持しつつ、定期的に更新
- stale-while-revalidate パターン
- 初回アクセス時は古いHTMLを返し、バックグラウンドで再生成

**適したページ**
- レッスン一覧
- レッスン詳細
- ブログ記事

## Cooking Lab ページ別方式選定

| ページ | 現在 | 推奨 | 理由 |
|--------|------|------|------|
| `/` (トップ) | CSR | SSG | 静的コンテンツ、SEO重要 |
| `/about` | CSR | SSG | 静的コンテンツ |
| `/lessons` | CSR | ISR (60s) | 一覧は頻繁に更新されない |
| `/lessons/[id]` | CSR | ISR (60s) | 詳細も頻繁に更新されない |
| `/mypage` | CSR | CSR | ユーザー固有データ |
| `/instructor` | CSR | CSR | ユーザー固有データ |
| `/admin/*` | CSR | CSR | 認証必須、リアルタイム性 |
| `/login`, `/register` | CSR | SSG | フォームのみ |

## 実装例

### レッスン一覧 (ISR)

```tsx
// frontend/src/app/lessons/page.tsx
import { Lesson } from '@/types/lesson';

async function getLessons(): Promise<Lesson[]> {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/lessons`, {
    next: { revalidate: 60 }
  });

  if (!res.ok) {
    throw new Error('Failed to fetch lessons');
  }

  const data = await res.json();
  return data.data;
}

export default async function LessonsPage() {
  const lessons = await getLessons();

  return (
    <div>
      {lessons.map(lesson => (
        <LessonCard key={lesson.id} lesson={lesson} />
      ))}
    </div>
  );
}
```

### レッスン詳細 (ISR + generateStaticParams)

```tsx
// frontend/src/app/lessons/[id]/page.tsx
import { Lesson } from '@/types/lesson';

// ビルド時に静的生成するパスを指定
export async function generateStaticParams() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/lessons`);
  const data = await res.json();

  return data.data.map((lesson: Lesson) => ({
    id: String(lesson.id),
  }));
}

async function getLesson(id: string): Promise<Lesson> {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/lessons/${id}`, {
    next: { revalidate: 60 }
  });

  if (!res.ok) {
    throw new Error('Failed to fetch lesson');
  }

  const data = await res.json();
  return data.data;
}

export default async function LessonDetailPage({
  params
}: {
  params: { id: string }
}) {
  const lesson = await getLesson(params.id);

  return <LessonDetail lesson={lesson} />;
}
```

## パフォーマンス比較

| 指標 | CSR | SSR | SSG | ISR |
|------|-----|-----|-----|-----|
| TTFB | 速 | 遅 | 最速 | 最速 |
| FCP | 遅 | 速 | 最速 | 最速 |
| LCP | 遅 | 速 | 最速 | 最速 |
| データ鮮度 | 最新 | 最新 | 古い | やや古い |
| サーバー負荷 | 低 | 高 | 最低 | 低 |

## 参考資料

- [Next.js Rendering](https://nextjs.org/docs/app/building-your-application/rendering)
- [Data Fetching](https://nextjs.org/docs/app/building-your-application/data-fetching)
