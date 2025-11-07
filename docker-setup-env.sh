#!/bin/bash
# Script para configurar .env para Docker

echo "🔧 Configurando .env para Docker..."

if [ ! -f .env ]; then
    echo "❌ Arquivo .env não encontrado!"
    exit 1
fi

# Backup do .env
cp .env .env.backup
echo "✅ Backup criado: .env.backup"

# Ajustar DB_HOST para mysql (nome do serviço Docker)
if grep -q "DB_HOST=localhost" .env || grep -q "DB_HOST=127.0.0.1" .env; then
    sed -i 's/DB_HOST=.*/DB_HOST=mysql/' .env
    echo "✅ DB_HOST ajustado para 'mysql'"
fi

# Ajustar credenciais padrão do Sail se não estiverem configuradas
if ! grep -q "DB_USERNAME=sail" .env; then
    if grep -q "^DB_USERNAME=" .env; then
        sed -i 's/^DB_USERNAME=.*/DB_USERNAME=sail/' .env
    else
        echo "DB_USERNAME=sail" >> .env
    fi
    echo "✅ DB_USERNAME ajustado para 'sail'"
fi

if ! grep -q "DB_PASSWORD=password" .env; then
    if grep -q "^DB_PASSWORD=" .env; then
        sed -i 's/^DB_PASSWORD=.*/DB_PASSWORD=password/' .env
    else
        echo "DB_PASSWORD=password" >> .env
    fi
    echo "✅ DB_PASSWORD ajustado para 'password'"
fi

# Adicionar variáveis do Docker se não existirem
if ! grep -q "^WWWGROUP=" .env; then
    echo "WWWGROUP=1000" >> .env
    echo "✅ WWWGROUP adicionado"
fi

if ! grep -q "^WWWUSER=" .env; then
    echo "WWWUSER=1000" >> .env
    echo "✅ WWWUSER adicionado"
fi

# Ajustar APP_PORT se não estiver definido
if ! grep -q "^APP_PORT=" .env; then
    echo "APP_PORT=80" >> .env
    echo "✅ APP_PORT adicionado"
fi

# Ajustar VITE_PORT se não estiver definido
if ! grep -q "^VITE_PORT=" .env; then
    echo "VITE_PORT=5173" >> .env
    echo "✅ VITE_PORT adicionado"
fi

echo ""
echo "✅ Configuração do .env concluída!"
echo ""
echo "📝 Variáveis importantes:"
echo "   DB_HOST=mysql (nome do serviço Docker)"
echo "   DB_USERNAME=sail"
echo "   DB_PASSWORD=password"
echo ""
echo "💡 Para reverter: cp .env.backup .env"

