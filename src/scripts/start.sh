#!/bin/bash
set -e

echo "🚀 Iniciando Docker Compose..."
docker compose up --build -d

echo "⏳ Aguardando banco de dados ficar pronto..."
DB_CONTAINER_NAME="investo-challenge-database-1"
DB_READY=false

while [ "$DB_READY" == false ]; do
  if docker logs "$DB_CONTAINER_NAME" 2>&1 | grep -q "database system is ready to accept connections"; then
    DB_READY=true
    echo "✅ Banco de dados pronto!"
  else
    echo "⏳ Aguardando mais alguns segundos..."

    sleep 5
  fi
done

echo "🚀 Executando scripts do prisma..."
npx prisma generate
npx prisma migrate dev
sleep 4

echo "🚀 Executando script de importação de dados..."
npx ts-node src/scripts/importData.ts


