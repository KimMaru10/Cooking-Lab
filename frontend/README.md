# 🍳 Cooking Lab - Frontend

Next.js 14 (App Router) で構築されたオンライン料理教室予約システムのフロントエンドです。

## 技術スタック

| 項目 | 技術 |
|------|------|
| フレームワーク | Next.js 14 (App Router) |
| 言語 | TypeScript |
| スタイリング | Tailwind CSS |
| UIコンポーネント | shadcn/ui |
| 状態管理 | TanStack Query (React Query) |
| フォーム | React Hook Form + Zod |
| HTTP クライアント | fetch (native) |
| テスト | Vitest, Testing Library |
| Linter/Formatter | ESLint, Prettier |

## ディレクトリ構成

```
src/
├── app/                        # App Router
│   ├── (auth)/                # 認証関連ページ（ログイン等）
│   │   ├── login/
│   │   │   └── page.tsx
│   │   └── register/
│   │       └── page.tsx
│   │
│   ├── (student)/             # 生徒向けページ
│   │   ├── lessons/
│   │   │   ├── page.tsx           # レッスン一覧
│   │   │   └── [id]/
│   │   │       └── page.tsx       # レッスン詳細
│   │   ├── reservations/
│   │   │   └── page.tsx           # 予約履歴
│   │   ├── tickets/
│   │   │   └── page.tsx           # チケット管理
│   │   └── layout.tsx
│   │
│   ├── (instructor)/          # 講師向けページ
│   │   ├── dashboard/
│   │   │   └── page.tsx           # ダッシュボード
│   │   ├── schedules/
│   │   │   └── [id]/
│   │   │       └── page.tsx       # レッスン実施
│   │   └── layout.tsx
│   │
│   ├── (admin)/               # 管理者向けページ
│   │   ├── lessons/
│   │   │   ├── page.tsx           # レッスン管理
│   │   │   └── new/
│   │   │       └── page.tsx       # レッスン登録
│   │   └── layout.tsx
│   │
│   ├── api/                   # Route Handlers (BFF)
│   │   └── ...
│   │
│   ├── layout.tsx             # ルートレイアウト
│   ├── page.tsx               # トップページ
│   └── globals.css
│
├── components/                # コンポーネント
│   ├── ui/                    # shadcn/ui コンポーネント
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   ├── dialog.tsx
│   │   └── ...
│   ├── layouts/               # レイアウトコンポーネント
│   │   ├── Header.tsx
│   │   ├── Footer.tsx
│   │   └── Sidebar.tsx
│   ├── lesson/                # レッスン関連コンポーネント
│   │   ├── LessonCard.tsx
│   │   ├── LessonList.tsx
│   │   └── ScheduleSelector.tsx
│   ├── reservation/           # 予約関連コンポーネント
│   │   ├── ReservationCard.tsx
│   │   ├── ReservationModal.tsx
│   │   └── CancelModal.tsx
│   └── ticket/                # チケット関連コンポーネント
│       ├── TicketBalance.tsx
│       └── PurchaseModal.tsx
│
├── hooks/                     # カスタムフック
│   ├── useAuth.ts
│   ├── useLessons.ts
│   ├── useReservations.ts
│   └── useTickets.ts
│
├── lib/                       # ユーティリティ
│   ├── api/                   # APIクライアント
│   │   ├── client.ts
│   │   ├── lessons.ts
│   │   ├── reservations.ts
│   │   └── tickets.ts
│   ├── utils.ts               # 汎用ユーティリティ
│   └── constants.ts           # 定数
│
├── types/                     # 型定義
│   ├── lesson.ts
│   ├── reservation.ts
│   ├── ticket.ts
│   └── user.ts
│
└── providers/                 # Context Providers
    ├── QueryProvider.tsx
    └── AuthProvider.tsx
```

## セットアップ

### Docker環境（推奨）

```bash
# プロジェクトルートから
docker compose up -d
docker compose exec frontend bash

# コンテナ内で実行
npm install
```

### ローカル環境

```bash
# 必要条件: Node.js 20.x 以上

cd frontend
npm install
cp .env.example .env.local
npm run dev
```

## 開発コマンド

### 開発サーバー

```bash
npm run dev
# http://localhost:3000 でアクセス可能
```

### ビルド

```bash
# 本番ビルド
npm run build

# ビルド結果をローカルで確認
npm run start
```

### コード品質

```bash
# ESLint
npm run lint

# ESLint（自動修正）
npm run lint:fix

# Prettier
npm run format

# 型チェック
npm run type-check
```

### テスト

```bash
# 全テスト実行
npm run test

# ウォッチモード
npm run test:watch

# カバレッジ
npm run test:coverage
```

### コンポーネント追加（shadcn/ui）

```bash
# 例: ボタンコンポーネント追加
npx shadcn-ui@latest add button

# 例: ダイアログ追加
npx shadcn-ui@latest add dialog
```

## 主要機能

### 生徒向け機能

| 機能 | ページ | 説明 |
|------|--------|------|
| レッスン一覧 | `/lessons` | カテゴリ・難易度でフィルター可能 |
| レッスン詳細 | `/lessons/[id]` | スケジュール選択・予約 |
| 予約履歴 | `/reservations` | 予約一覧・キャンセル |
| チケット管理 | `/tickets` | 残数確認・購入 |

### 講師向け機能

| 機能 | ページ | 説明 |
|------|--------|------|
| ダッシュボード | `/instructor/dashboard` | 担当レッスン一覧 |
| レッスン実施 | `/instructor/schedules/[id]` | 出席管理 |

### 管理者向け機能

| 機能 | ページ | 説明 |
|------|--------|------|
| レッスン管理 | `/admin/lessons` | レッスン一覧・編集 |
| レッスン登録 | `/admin/lessons/new` | 新規レッスン作成 |

## APIクライアント

### 設定

```typescript
// src/lib/api/client.ts

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

export async function fetchApi<T>(
  endpoint: string,
  options?: RequestInit
): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
    credentials: 'include',
  });

  if (!response.ok) {
    throw new Error(`API Error: ${response.status}`);
  }

  return response.json();
}
```

### 使用例

```typescript
// src/lib/api/lessons.ts

import { fetchApi } from './client';
import { Lesson, LessonDetail } from '@/types/lesson';

export async function getLessons(): Promise<Lesson[]> {
  return fetchApi<Lesson[]>('/lessons');
}

export async function getLessonDetail(id: string): Promise<LessonDetail> {
  return fetchApi<LessonDetail>(`/lessons/${id}`);
}
```

### TanStack Query フック

```typescript
// src/hooks/useLessons.ts

import { useQuery } from '@tanstack/react-query';
import { getLessons, getLessonDetail } from '@/lib/api/lessons';

export function useLessons() {
  return useQuery({
    queryKey: ['lessons'],
    queryFn: getLessons,
  });
}

export function useLessonDetail(id: string) {
  return useQuery({
    queryKey: ['lessons', id],
    queryFn: () => getLessonDetail(id),
  });
}
```

## 型定義

```typescript
// src/types/lesson.ts

export type Category = 'japanese' | 'western' | 'chinese' | 'dessert';
export type DifficultyLevel = 'beginner' | 'intermediate' | 'advanced';

export interface Lesson {
  id: string;
  title: string;
  description: string;
  category: Category;
  difficultyLevel: DifficultyLevel;
  imageUrl: string;
}

export interface Schedule {
  id: string;
  lessonId: string;
  instructorId: string;
  instructorName: string;
  startsAt: string;
  endsAt: string;
  capacity: number;
  currentParticipants: number;
  isFull: boolean;
}

export interface LessonDetail extends Lesson {
  schedules: Schedule[];
}
```

```typescript
// src/types/reservation.ts

export type ReservationStatus = 'reserved' | 'cancelled' | 'attended' | 'absent';

export interface Reservation {
  id: string;
  lessonId: string;
  lessonTitle: string;
  scheduleId: string;
  startsAt: string;
  status: ReservationStatus;
  createdAt: string;
}
```

```typescript
// src/types/ticket.ts

export type TicketStatus = 'unused' | 'used' | 'expired';

export interface Ticket {
  id: string;
  status: TicketStatus;
  expirationDate: string;
  usedAt: string | null;
}

export interface TicketPlan {
  id: string;
  name: string;
  quantity: number;
  price: number;
}

export interface TicketBalance {
  total: number;
  available: number;
  expiringSoon: number; // 30日以内に期限切れ
}
```

## 環境変数

```env
# .env.local

# API
NEXT_PUBLIC_API_URL=http://localhost:8000/api

# 認証
NEXT_PUBLIC_AUTH_COOKIE_NAME=cooking_lab_token
```

## スタイリング

### Tailwind CSS 設定

```typescript
// tailwind.config.ts

import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#fef7ee',
          // ... カスタムカラー
          500: '#f97316',
          600: '#ea580c',
        },
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
};

export default config;
```

### コンポーネント例

```tsx
// src/components/lesson/LessonCard.tsx

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Lesson } from '@/types/lesson';

interface LessonCardProps {
  lesson: Lesson;
}

export function LessonCard({ lesson }: LessonCardProps) {
  const difficultyLabels = {
    beginner: '初級',
    intermediate: '中級',
    advanced: '上級',
  };

  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader>
        <div className="flex justify-between items-start">
          <CardTitle className="text-lg">{lesson.title}</CardTitle>
          <Badge variant="secondary">
            {difficultyLabels[lesson.difficultyLevel]}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground line-clamp-2">
          {lesson.description}
        </p>
      </CardContent>
    </Card>
  );
}
```

## テスト

### ユニットテスト例

```tsx
// src/components/lesson/__tests__/LessonCard.test.tsx

import { render, screen } from '@testing-library/react';
import { LessonCard } from '../LessonCard';

describe('LessonCard', () => {
  const mockLesson = {
    id: '1',
    title: '基本の和食',
    description: '出汁の取り方から学ぶ和食の基本',
    category: 'japanese' as const,
    difficultyLevel: 'beginner' as const,
    imageUrl: '/images/lessons/1.jpg',
  };

  it('レッスンタイトルが表示される', () => {
    render(<LessonCard lesson={mockLesson} />);
    expect(screen.getByText('基本の和食')).toBeInTheDocument();
  });

  it('難易度が日本語で表示される', () => {
    render(<LessonCard lesson={mockLesson} />);
    expect(screen.getByText('初級')).toBeInTheDocument();
  });
});
```

## 参考資料

- [Next.js公式ドキュメント](https://nextjs.org/docs)
- [Tailwind CSS](https://tailwindcss.com/)
- [shadcn/ui](https://ui.shadcn.com/)
- [TanStack Query](https://tanstack.com/query/latest)
- [React Hook Form](https://react-hook-form.com/)
- [Zod](https://zod.dev/)
