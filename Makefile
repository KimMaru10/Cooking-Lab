.PHONY: help build up down restart logs ps clean setup migrate seed fresh test

# デフォルトターゲット
help:
	@echo "Cooking Lab - Docker Commands"
	@echo ""
	@echo "セットアップ:"
	@echo "  make setup     - 初回セットアップ（ビルド + 起動 + マイグレーション）"
	@echo ""
	@echo "Docker操作:"
	@echo "  make build     - イメージをビルド"
	@echo "  make up        - コンテナを起動"
	@echo "  make down      - コンテナを停止"
	@echo "  make restart   - コンテナを再起動"
	@echo "  make logs      - ログを表示"
	@echo "  make ps        - コンテナ状態を表示"
	@echo "  make clean     - コンテナとボリュームを削除"
	@echo ""
	@echo "Laravel操作:"
	@echo "  make migrate   - マイグレーション実行"
	@echo "  make seed      - シーダー実行"
	@echo "  make fresh     - DBリセット + マイグレーション + シード"
	@echo "  make test      - テスト実行"
	@echo "  make tinker    - Laravel Tinker起動"
	@echo ""
	@echo "シェルアクセス:"
	@echo "  make backend   - バックエンドコンテナに入る"
	@echo "  make frontend  - フロントエンドコンテナに入る"
	@echo ""
	@echo "アクセスURL:"
	@echo "  Frontend:    http://localhost:3000"
	@echo "  Backend API: http://localhost:8000/api"
	@echo "  phpMyAdmin:  http://localhost:8080"

# ========== セットアップ ==========
setup:
	@echo "🚀 初回セットアップを開始します..."
	@make build
	@make up
	@echo "⏳ データベースの起動を待機中..."
	@sleep 10
	@make backend-setup
	@make frontend-setup
	@echo ""
	@echo "✅ セットアップ完了！"
	@echo ""
	@echo "アクセスURL:"
	@echo "  Frontend:    http://localhost:3000"
	@echo "  Backend API: http://localhost:8000/api"
	@echo "  phpMyAdmin:  http://localhost:8080"

backend-setup:
	@echo "📦 バックエンドのセットアップ中..."
	docker compose exec -u root backend mkdir -p /var/www/html/vendor
	docker compose exec -u root backend chown -R www:www /var/www/html/vendor
	docker compose exec backend composer install
	docker compose exec backend cp -n .env.example .env || true
	docker compose exec backend php artisan key:generate
	docker compose exec backend php artisan migrate --seed
	docker compose exec backend php artisan storage:link || true

frontend-setup:
	@echo "📦 フロントエンドのセットアップ中..."
	@echo "※ npm installはコンテナ起動時に自動実行されます"

# ========== Docker操作 ==========
build:
	docker compose build

up:
	docker compose up -d

down:
	docker compose down

restart:
	docker compose restart

logs:
	docker compose logs -f

ps:
	docker compose ps

clean:
	docker compose down -v --rmi all

# ========== Laravel操作 ==========
migrate:
	docker compose exec backend php artisan migrate

seed:
	docker compose exec backend php artisan db:seed

fresh:
	docker compose exec backend php artisan migrate:fresh --seed

test:
	docker compose exec backend php artisan test

tinker:
	docker compose exec backend php artisan tinker

# ========== シェルアクセス ==========
backend:
	docker compose exec backend bash

frontend:
	docker compose exec frontend sh
