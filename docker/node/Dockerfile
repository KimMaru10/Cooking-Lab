FROM node:20-alpine

# 作業ディレクトリを設定
WORKDIR /app

# npmのグローバル設定
RUN npm config set fund false && \
    npm config set audit false

# 開発用ツールをインストール
RUN apk add --no-cache git

# entrypointスクリプトをコピー
COPY docker/node/entrypoint.sh /usr/local/bin/entrypoint.sh
RUN chmod +x /usr/local/bin/entrypoint.sh

EXPOSE 3000

ENTRYPOINT ["/usr/local/bin/entrypoint.sh"]
CMD ["npm", "run", "dev"]
