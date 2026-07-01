#!/usr/bin/env bash
# Deploy do KITE360º — roda no servidor, dentro de /www/wwwroot/kitecoder
# Uso:
#   ./deploy.sh          -> deploy normal (build com cache)
#   ./deploy.sh --clean  -> força rebuild sem cache (use se algo não atualizar)
set -e

cd "$(dirname "$0")"

echo "==> git pull"
git pull

BUILD_ARGS=""
if [ "$1" = "--clean" ]; then
  BUILD_ARGS="--no-cache"
  echo "==> build SEM cache"
else
  echo "==> build"
fi

docker compose build $BUILD_ARGS web api

echo "==> subindo containers (recria web/api com a imagem nova)"
docker compose up -d --force-recreate web api

echo "==> reiniciando proxy (pega o novo IP dos containers)"
docker compose restart proxy

echo "==> pronto. Containers:"
docker compose ps
