#!/bin/sh
set -e

# node_modulesが存在しない場合はインストール
if [ ! -d "node_modules" ] || [ ! -f "node_modules/.package-lock.json" ]; then
    echo "📦 Installing dependencies..."
    npm install
fi

# コマンドを実行
exec "$@"
