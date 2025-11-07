#!/bin/bash
# Script para alternar .env entre Docker e Local

if [ ! -f .env ]; then
    echo "❌ Arquivo .env não encontrado!"
    exit 1
fi

if [ "$1" == "docker" ]; then
    # Backup
    cp .env .env.backup.$(date +%Y%m%d_%H%M%S)
    
    # Ajustar para Docker
    sed -i 's/DB_HOST=.*/DB_HOST=mysql/' .env
    sed -i 's/^DB_USERNAME=.*/DB_USERNAME=sail/' .env
    sed -i 's/^DB_PASSWORD=.*/DB_PASSWORD=password/' .env
    
    echo "✅ .env configurado para DOCKER"
    echo "   DB_HOST=mysql"
    echo "   DB_USERNAME=sail"
    echo "   DB_PASSWORD=password"
    echo ""
    echo "💡 Agora use: docker compose exec laravel.test php artisan migrate"
    
elif [ "$1" == "local" ]; then
    # Backup
    cp .env .env.backup.$(date +%Y%m%d_%H%M%S)
    
    # Ajustar para Local
    sed -i 's/DB_HOST=.*/DB_HOST=127.0.0.1/' .env
    sed -i 's/^DB_USERNAME=.*/DB_USERNAME=root/' .env
    sed -i 's/^DB_PASSWORD=.*/DB_PASSWORD=/' .env
    
    echo "✅ .env configurado para LOCAL"
    echo "   DB_HOST=127.0.0.1"
    echo "   DB_USERNAME=root"
    echo "   DB_PASSWORD=(vazio)"
    echo ""
    echo "💡 Agora use: php artisan migrate"
    
else
    echo "❌ Uso incorreto!"
    echo ""
    echo "Uso: ./switch-env.sh [docker|local]"
    echo ""
    echo "Exemplos:"
    echo "  ./switch-env.sh docker  # Para usar Docker"
    echo "  ./switch-env.sh local    # Para usar MySQL local"
    exit 1
fi

