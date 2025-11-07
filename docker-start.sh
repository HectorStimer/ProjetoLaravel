#!/bin/bash
# Script de Inicialização Docker - Linux/Mac
# Execute: chmod +x docker-start.sh && ./docker-start.sh

echo "🐳 Iniciando containers Docker..."

# Verificar se Docker está rodando
if ! docker info > /dev/null 2>&1; then
    echo "❌ Docker não está rodando! Inicie o Docker primeiro."
    echo "   Execute: sudo systemctl start docker"
    exit 1
fi

# Verificar se .env existe
if [ ! -f .env ]; then
    echo "⚠️  Arquivo .env não encontrado. Criando a partir do exemplo..."
    if [ -f .env.example ]; then
        cp .env.example .env
    else
        echo "❌ Arquivo .env.example não encontrado. Crie o arquivo .env manualmente."
        exit 1
    fi
fi

# Configurar .env para Docker
if [ -f docker-setup-env.sh ]; then
    chmod +x docker-setup-env.sh
    ./docker-setup-env.sh
fi

# Subir containers
echo "📦 Subindo containers..."
docker compose up -d

if [ $? -ne 0 ]; then
    echo "❌ Erro ao subir containers!"
    exit 1
fi

# Aguardar containers ficarem prontos
echo "⏳ Aguardando containers ficarem prontos..."
sleep 10

# Gerar chave da aplicação
echo "🔑 Gerando chave da aplicação..."
docker compose exec -T laravel.test php artisan key:generate

# Instalar dependências Composer
echo "📥 Instalando dependências do Composer..."
docker compose exec -T laravel.test composer install

# Instalar dependências NPM
echo "📦 Instalando dependências do NPM..."
docker compose exec -T laravel.test npm install

# Rodar migrations
echo "🗄️  Rodando migrations..."
docker compose exec -T laravel.test php artisan migrate --force

# Rodar seeders
echo "🌱 Rodando seeders..."
docker compose exec -T laravel.test php artisan db:seed --force

# Compilar assets
echo "🎨 Compilando assets..."
docker compose exec -T laravel.test npm run build

echo ""
echo "✅ Pronto! Aplicação rodando em http://localhost"
echo ""
echo "📝 Comandos úteis:"
echo "  - Ver logs: docker compose logs -f laravel.test"
echo "  - Parar: docker compose down"
echo "  - Acessar container: docker compose exec laravel.test bash"
echo ""

