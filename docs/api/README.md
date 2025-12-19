# API仕様書

クッキングラボ予約システムのAPI仕様です。

## OpenAPI仕様

[swagger.yml](./swagger.yml)

## 確認方法

### Swagger Editor（ブラウザ）

1. https://editor.swagger.io/ にアクセス
2. File > Import file から `swagger.yml` をアップロード
3. 右側にドキュメントが表示される

### VSCode拡張機能

1. `OpenAPI (Swagger) Editor` 拡張機能をインストール
2. `swagger.yml` を開いてプレビュー

### Swagger UI（ローカル）

```bash
# Docker で起動
docker run -p 8081:8080 -e SWAGGER_JSON=/api/swagger.yml -v $(pwd)/docs/api:/api swaggerapi/swagger-ui
```

http://localhost:8081 でアクセス

## API概要

### エンドポイント一覧

| メソッド | パス | 説明 | アクター |
|---------|------|------|---------|
| **認証** |
| POST | /auth/register | 生徒登録 | - |
| POST | /auth/login | ログイン | - |
| POST | /auth/logout | ログアウト | 全員 |
| GET | /auth/me | ユーザー情報取得 | 全員 |
| **レッスン** |
| GET | /lessons | レッスン一覧 | 全員 |
| GET | /lessons/{id} | レッスン詳細 | 全員 |
| POST | /lessons | レッスン登録 | スタッフ |
| PUT | /lessons/{id} | レッスン更新 | スタッフ |
| DELETE | /lessons/{id} | レッスン削除 | スタッフ |
| **スケジュール** |
| POST | /lessons/{id}/schedules | スケジュール追加 | スタッフ |
| PUT | /schedules/{id} | スケジュール更新 | スタッフ |
| DELETE | /schedules/{id} | スケジュール削除 | スタッフ |
| **予約** |
| GET | /reservations | 予約一覧 | 生徒 |
| POST | /reservations | 予約作成 | 生徒 |
| GET | /reservations/{id} | 予約詳細 | 生徒 |
| DELETE | /reservations/{id} | 予約キャンセル | 生徒 |
| **チケット** |
| GET | /tickets | チケット一覧 | 生徒 |
| POST | /tickets | チケット購入 | 生徒 |
| **出欠管理** |
| GET | /instructor/schedules | 担当スケジュール一覧 | 講師 |
| GET | /instructor/schedules/{id}/students | 予約生徒一覧 | 講師 |
| POST | /schedules/{id}/start | レッスン開始 | 講師 |
| POST | /reservations/{id}/attendance | 出欠記録 | 講師 |

### 認証

Laravel Sanctum を使用したトークン認証。

```bash
# ログイン
curl -X POST http://localhost:8000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email": "yamada@example.com", "password": "password123"}'

# レスポンス
{
  "user": { "id": "STU-001", "name": "山田太郎", ... },
  "token": "1|abcdefghijklmnopqrstuvwxyz"
}

# 認証が必要なエンドポイント
curl http://localhost:8000/api/reservations \
  -H "Authorization: Bearer 1|abcdefghijklmnopqrstuvwxyz"
```

### エラーレスポンス

| コード | 説明 |
|--------|------|
| 400 | リクエストエラー（ビジネスルール違反など） |
| 401 | 認証エラー |
| 403 | 権限エラー |
| 404 | リソースが見つからない |
| 422 | バリデーションエラー |
| 409 | 競合エラー（削除不可など） |

```json
{
  "message": "チケットが不足しています",
  "code": "INSUFFICIENT_TICKETS"
}
```

### ビジネスルール

| ルール | API影響 |
|--------|--------|
| チケットFIFO消費 | POST /reservations で自動適用 |
| 24時間前キャンセル | DELETE /reservations で期限チェック |
| 定員チェック | POST /reservations で空きチェック |
| ペナルティ停止 | POST /reservations で停止チェック |
| ペナルティ付与 | POST /reservations/{id}/attendance (absent) |
