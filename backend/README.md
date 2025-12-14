# 🍳 Cooking Lab - Backend

Laravel 11 で構築されたオンライン料理教室予約システムのバックエンドAPIです。  
ドメイン駆動設計（DDD）のアーキテクチャを採用しています。

## 技術スタック

| 項目 | 技術 |
|------|------|
| 言語 | PHP 8.3 |
| フレームワーク | Laravel 11 |
| データベース | MySQL 8.0 |
| 認証 | Laravel Sanctum |
| テスト | PHPUnit |
| 静的解析 | PHPStan |
| コードフォーマット | PHP CS Fixer |

## ディレクトリ構成（DDD）

```
app/
├── Domain/                     # ドメイン層
│   ├── Lesson/                # レッスン集約
│   │   ├── Entity/
│   │   │   ├── Lesson.php
│   │   │   └── Schedule.php
│   │   ├── ValueObject/
│   │   │   ├── LessonId.php
│   │   │   ├── ScheduleId.php
│   │   │   ├── LessonTitle.php
│   │   │   ├── Category.php
│   │   │   ├── DifficultyLevel.php
│   │   │   └── Capacity.php
│   │   ├── Repository/
│   │   │   └── LessonRepositoryInterface.php
│   │   └── Service/
│   │
│   ├── Reservation/           # 予約集約
│   │   ├── Entity/
│   │   │   └── Reservation.php
│   │   ├── ValueObject/
│   │   │   ├── ReservationId.php
│   │   │   └── ReservationStatus.php
│   │   ├── Repository/
│   │   │   └── ReservationRepositoryInterface.php
│   │   └── Service/
│   │
│   ├── Student/               # 生徒集約
│   │   ├── Entity/
│   │   │   └── Student.php
│   │   ├── ValueObject/
│   │   │   ├── StudentId.php
│   │   │   └── PenaltyPoint.php
│   │   └── Repository/
│   │       └── StudentRepositoryInterface.php
│   │
│   ├── Ticket/                # チケット集約
│   │   ├── Entity/
│   │   │   ├── Ticket.php
│   │   │   └── TicketPlan.php
│   │   ├── ValueObject/
│   │   │   ├── TicketId.php
│   │   │   ├── ExpirationDate.php
│   │   │   └── TicketStatus.php
│   │   ├── Repository/
│   │   │   └── TicketRepositoryInterface.php
│   │   └── Service/
│   │       └── TicketConsumptionService.php
│   │
│   └── Shared/                # 共有カーネル
│       ├── Entity/
│       │   └── AggregateRoot.php
│       └── ValueObject/
│           ├── Id.php
│           ├── Email.php
│           └── DateTime.php
│
├── UseCase/                   # ユースケース層（アプリケーション層）
│   ├── Lesson/
│   │   ├── RegisterLessonUseCase.php
│   │   ├── AddScheduleUseCase.php
│   │   ├── GetLessonListUseCase.php
│   │   └── GetLessonDetailUseCase.php
│   ├── Reservation/
│   │   ├── MakeReservationUseCase.php
│   │   ├── CancelReservationUseCase.php
│   │   └── GetReservationHistoryUseCase.php
│   └── Ticket/
│       ├── PurchaseTicketUseCase.php
│       └── GetAvailableTicketsUseCase.php
│
├── Infrastructure/            # インフラストラクチャ層
│   ├── Repository/
│   │   ├── EloquentLessonRepository.php
│   │   ├── EloquentReservationRepository.php
│   │   ├── EloquentStudentRepository.php
│   │   └── EloquentTicketRepository.php
│   └── QueryService/
│       └── ...
│
├── Http/                      # プレゼンテーション層
│   ├── Controllers/
│   │   └── Api/
│   │       ├── LessonController.php
│   │       ├── ReservationController.php
│   │       └── TicketController.php
│   ├── Requests/
│   └── Resources/
│
├── Models/                    # Eloquentモデル（Infrastructure層の一部）
└── Providers/
    └── AppServiceProvider.php # DIコンテナ設定
```

## セットアップ

### Docker環境（推奨）

```bash
# プロジェクトルートから
docker compose up -d
docker compose exec backend bash

# コンテナ内で実行
composer install
cp .env.example .env
php artisan key:generate
php artisan migrate --seed
```

### ローカル環境

```bash
# 必要条件: PHP 8.3, Composer, MySQL 8.0

cd backend
composer install
cp .env.example .env
php artisan key:generate

# .envのDB設定を編集してから
php artisan migrate --seed
php artisan serve
```

## 開発コマンド

### サーバー起動

```bash
php artisan serve
# http://localhost:8000 でアクセス可能
```

### データベース

```bash
# マイグレーション実行
php artisan migrate

# マイグレーションリセット & 再実行
php artisan migrate:fresh

# シーダー実行
php artisan db:seed

# マイグレーション + シーダー
php artisan migrate:fresh --seed
```

### テスト

```bash
# 全テスト実行
php artisan test

# 特定のテストファイル
php artisan test tests/Unit/Domain/Ticket/TicketTest.php

# カバレッジ付き
php artisan test --coverage
```

### コード品質

```bash
# 静的解析（PHPStan）
./vendor/bin/phpstan analyse

# コードフォーマット（PHP CS Fixer）
./vendor/bin/php-cs-fixer fix

# フォーマットチェックのみ
./vendor/bin/php-cs-fixer fix --dry-run --diff
```

### その他

```bash
# ルート一覧
php artisan route:list

# キャッシュクリア
php artisan cache:clear
php artisan config:clear
php artisan route:clear

# Tinker（REPL）
php artisan tinker
```

## API仕様

### 認証

| メソッド | エンドポイント | 説明 |
|---------|---------------|------|
| POST | /api/register | 会員登録 |
| POST | /api/login | ログイン |
| POST | /api/logout | ログアウト |

### レッスン

| メソッド | エンドポイント | 説明 |
|---------|---------------|------|
| GET | /api/lessons | レッスン一覧取得 |
| GET | /api/lessons/{id} | レッスン詳細取得 |
| POST | /api/lessons | レッスン登録（管理者） |
| POST | /api/lessons/{id}/schedules | スケジュール追加（管理者） |

### 予約

| メソッド | エンドポイント | 説明 |
|---------|---------------|------|
| GET | /api/reservations | 予約履歴取得 |
| POST | /api/reservations | 予約する |
| DELETE | /api/reservations/{id} | 予約キャンセル |

### チケット

| メソッド | エンドポイント | 説明 |
|---------|---------------|------|
| GET | /api/tickets | 保有チケット一覧 |
| POST | /api/tickets/purchase | チケット購入 |

## アーキテクチャ

### レイヤー構成

```
┌─────────────────────────────────────────┐
│  Http (Controllers, Requests, Resources)│  プレゼンテーション層
├─────────────────────────────────────────┤
│  UseCase                                │  アプリケーション層
├─────────────────────────────────────────┤
│  Domain (Entity, ValueObject, Service)  │  ドメイン層
├─────────────────────────────────────────┤
│  Infrastructure (Repository, Query)     │  インフラストラクチャ層
└─────────────────────────────────────────┘
```

### 依存関係のルール

- 上位レイヤーは下位レイヤーに依存できる
- 下位レイヤーは上位レイヤーに依存してはいけない
- Domain層は他のどのレイヤーにも依存しない
- Infrastructure層のリポジトリはDomain層のインターフェースを実装する

### DIコンテナ設定

```php
// app/Providers/AppServiceProvider.php

public function register(): void
{
    // リポジトリのバインド
    $this->app->bind(
        LessonRepositoryInterface::class,
        EloquentLessonRepository::class
    );
    
    $this->app->bind(
        ReservationRepositoryInterface::class,
        EloquentReservationRepository::class
    );
    
    // ...
}
```

## テスト方針

### ユニットテスト

```
tests/
├── Unit/
│   ├── Domain/
│   │   ├── Lesson/
│   │   ├── Reservation/
│   │   ├── Student/
│   │   └── Ticket/
│   └── UseCase/
└── Feature/
    └── Api/
```

- **Domain層**: エンティティ、値オブジェクト、ドメインサービスのテスト
- **UseCase層**: モックを使用したユースケースのテスト
- **Feature**: APIエンドポイントの統合テスト

### テスト例

```php
// tests/Unit/Domain/Ticket/TicketTest.php

class TicketTest extends TestCase
{
    public function test_有効期限内のチケットは使用できる(): void
    {
        $ticket = new Ticket(
            id: new TicketId('ticket-1'),
            studentId: new StudentId('student-1'),
            expirationDate: new ExpirationDate(now()->addMonths(6)),
            status: TicketStatus::UNUSED
        );
        
        $this->assertTrue($ticket->canUse());
    }
    
    public function test_有効期限切れのチケットは使用できない(): void
    {
        $ticket = new Ticket(
            id: new TicketId('ticket-1'),
            studentId: new StudentId('student-1'),
            expirationDate: new ExpirationDate(now()->subDay()),
            status: TicketStatus::UNUSED
        );
        
        $this->assertFalse($ticket->canUse());
    }
}
```

## 環境変数

```env
# アプリケーション
APP_NAME="Cooking Lab"
APP_ENV=local
APP_DEBUG=true
APP_URL=http://localhost:8000

# データベース
DB_CONNECTION=mysql
DB_HOST=db
DB_PORT=3306
DB_DATABASE=cooking_lab
DB_USERNAME=cooking_lab
DB_PASSWORD=secret

# Sanctum
SANCTUM_STATEFUL_DOMAINS=localhost:3000

# フロントエンドURL（CORS設定用）
FRONTEND_URL=http://localhost:3000
```

## 参考資料

- [Laravel公式ドキュメント](https://laravel.com/docs)
- [PHPStan](https://phpstan.org/)
- [PHP CS Fixer](https://cs.symfony.com/)
