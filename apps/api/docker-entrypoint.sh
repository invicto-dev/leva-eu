#!/bin/sh
set -e

echo "Sincronizando banco de dados (prisma db push)..."

# Executa o push do banco a partir da raiz do monorepo
cd /app
npx turbo run db:push --filter=@core/db

echo "Garantindo dados básicos (seed)..."
npx turbo run db:seed --filter=@core/db

echo "Banco de dados e sementes processados com sucesso."

# Retorna para a pasta da API
cd /app/apps/api

# Executa o comando passado para o container (CMD)
exec "$@"
