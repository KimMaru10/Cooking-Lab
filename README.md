# 🍳 Cooking Lab

DDD学習用：オンライン料理教室予約システム - sudoモデリングで設計から実装まで

## 概要

料理教室「クッキングラボ」の予約管理システムです。  
ドメイン駆動設計（DDD）の実践を目的とし、sudoモデリング手法を用いて設計・実装を行います。

## 技術スタック

| レイヤー | 技術 |
|---------|------|
| フロントエンド | Next.js 14 (App Router), TypeScript, Tailwind CSS |
| バックエンド | Laravel 11, PHP 8.3 |
| データベース | MySQL 8.0 |
| インフラ | Docker, Docker Compose |
| API | REST API |

## プロジェクト構成

```
cooking-lab/
├── backend/          # Laravel（API）
├── frontend/         # Next.js（Web UI）
├── docs/             # 設計ドキュメント
│   ├── modeling/     # sudoモデリング成果物
│   └── api/          # API仕様書
├── docker-compose.yml
└── README.md         # このファイル
```

## 要件定義

### 背景

料理教室「クッキングラボ」は、対面とオンラインでレッスンを提供しています。  
現在はExcelと電話で予約管理をしていますが、管理が煩雑になってきたため、予約管理システムを構築することになりました。

### アクター

| アクター | 説明 |
|---------|------|
| 生徒 | レッスンを予約・受講する人 |
| 講師 | レッスンを開催する人 |
| 運営スタッフ | レッスンの登録や全体管理を行う |

### 業務要件

#### レッスン管理

- 運営スタッフがレッスンを登録する
- レッスンには「和食」「洋食」「中華」「お菓子」などのカテゴリがある
- レッスンには難易度（初級・中級・上級）がある
- 1つのレッスンに対して複数の開催日程（スケジュール）を設定できる
- 各スケジュールには定員がある（最小1名〜最大8名）
- 講師は1つのスケジュールに1名アサインされる

#### 予約管理

- 生徒はスケジュールを選んで予約する
- 予約時にはチケットを1枚消費する（事前購入制）
- 定員に達したスケジュールには予約できない
- 予約は開催日の24時間前までキャンセル可能
- キャンセルするとチケットが1枚返却される
- 同じスケジュールに重複予約はできない

#### チケット管理

- 生徒はチケットを購入できる（1枚、5枚、10枚のプランがある）
- チケットには有効期限がある（購入日から6ヶ月）
- 有効期限切れのチケットは使用できない
- 古いチケットから優先的に消費される（FIFO）

#### レッスン実施

- 開催時刻になると、講師がレッスンを「開始」できる
- レッスン終了後、講師は参加した生徒に「出席」をつける
- 無断欠席した生徒にはペナルティポイントが加算される
- ペナルティポイントが3点に達すると、新規予約が1ヶ月停止される

### ドメイン知識・ルール

| ルール | 詳細 |
|--------|------|
| チケット消費順序 | 有効期限が近いものから消費（FIFO） |
| キャンセル期限 | 開催日時の24時間前まで |
| 定員 | 1〜8名（スケジュールごとに設定） |
| チケット有効期限 | 購入日から6ヶ月 |
| ペナルティ上限 | 3点で1ヶ月間予約停止 |

## sudoモデリング

### ①システム関連図

[システム関連図](./docs/modeling/system-context.md)

### ②ユースケース図

```
[作成予定]
```

### ③ドメインモデル図

```
[作成予定]
```

### ④オブジェクト図

```
[作成予定]
```

## セットアップ

### 必要条件

- Docker Desktop
- Git

### クイックスタート

```bash
# リポジトリをクローン
git clone https://github.com/your-username/cooking-lab.git
cd cooking-lab

# Docker環境を起動
docker compose up -d

# バックエンドのセットアップ
docker compose exec backend composer install
docker compose exec backend cp .env.example .env
docker compose exec backend php artisan key:generate
docker compose exec backend php artisan migrate --seed

# フロントエンドのセットアップ
docker compose exec frontend npm install
```

### アクセス

| サービス | URL |
|---------|-----|
| フロントエンド | http://localhost:3000 |
| バックエンドAPI | http://localhost:8000/api |
| phpMyAdmin | http://localhost:8080 |

## 開発ガイド

各プロジェクトの詳細なセットアップ・開発ガイドは以下を参照してください。

- [バックエンド (Laravel)](./backend/README.md)
- [フロントエンド (Next.js)](./frontend/README.md)

## ドキュメント

- [TODO / ロードマップ](./TODO.md)
- [API仕様書](./docs/api/README.md)
- [モデリング成果物](./docs/modeling/README.md)

## 参考資料

- [sudoモデリング解説動画](https://www.youtube.com/watch?v=HgtCKlOzRiQ)
- [ドメイン駆動設計入門](https://www.shoeisha.co.jp/book/detail/9784798150727)
- [Laravel公式ドキュメント](https://laravel.com/docs)
- [Next.js公式ドキュメント](https://nextjs.org/docs)

## ライセンス

このプロジェクトは学習目的で作成されています。
