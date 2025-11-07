# 🔧 Solução: Erro ao Rodar Migrations

## ❌ Erro Encontrado

```
SQLSTATE[HY000] [2002] php_network_getaddresses: getaddrinfo for mysql failed
```

## 🔍 Causa

Você está tentando rodar `php artisan migrate` **localmente**, mas o `.env` está configurado para **Docker** (`DB_HOST=mysql`).

## ✅ Soluções

### Opção 1: Rodar dentro do Docker (Recomendado)

#### 1.1. Corrigir Permissão do Docker

Se você recebeu erro de permissão:
```bash
# Adicionar seu usuário ao grupo docker
sudo usermod -aG docker $USER

# Fazer logout e login novamente (ou executar):
newgrp docker

# Verificar se funcionou
docker ps
```

#### 1.2. Subir Containers
```bash
docker compose up -d
```

#### 1.3. Aguardar MySQL inicializar
```bash
# Aguardar 15-20 segundos
sleep 20

# Verificar se está rodando
docker compose ps
```

#### 1.4. Rodar Migrations dentro do Docker
```bash
docker compose exec laravel.test php artisan migrate
```

### Opção 2: Rodar Localmente (Fora do Docker)

Se você quer rodar localmente sem Docker:

#### 2.1. Ajustar `.env` para Local

Edite o `.env` e mude:
```env
DB_CONNECTION=mysql
DB_HOST=127.0.0.1    # ou localhost (não 'mysql')
DB_PORT=3306
DB_DATABASE=laravel
DB_USERNAME=root      # seu usuário MySQL local
DB_PASSWORD=          # sua senha MySQL local
```

#### 2.2. Garantir que MySQL está rodando localmente
```bash
# Verificar se MySQL está rodando
sudo systemctl status mysql
# ou
sudo systemctl status mariadb

# Se não estiver rodando:
sudo systemctl start mysql
```

#### 2.3. Criar banco de dados local
```bash
mysql -u root -p
CREATE DATABASE laravel CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
exit
```

#### 2.4. Rodar Migrations
```bash
php artisan migrate
```

### Opção 3: Script para Alternar Entre Docker e Local

Crie um script para alternar facilmente:

```bash
# Criar arquivo: switch-env.sh
#!/bin/bash
if [ "$1" == "docker" ]; then
    sed -i 's/DB_HOST=.*/DB_HOST=mysql/' .env
    sed -i 's/DB_USERNAME=.*/DB_USERNAME=sail/' .env
    sed -i 's/DB_PASSWORD=.*/DB_PASSWORD=password/' .env
    echo "✅ Configurado para Docker"
elif [ "$1" == "local" ]; then
    sed -i 's/DB_HOST=.*/DB_HOST=127.0.0.1/' .env
    sed -i 's/DB_USERNAME=.*/DB_USERNAME=root/' .env
    sed -i 's/DB_PASSWORD=.*/DB_PASSWORD=/' .env
    echo "✅ Configurado para Local"
else
    echo "Uso: ./switch-env.sh [docker|local]"
fi
```

## 🎯 Recomendação

**Use Docker** para manter o ambiente consistente:

```bash
# 1. Corrigir permissão (se necessário)
sudo usermod -aG docker $USER
newgrp docker

# 2. Subir containers
docker compose up -d

# 3. Aguardar MySQL
sleep 20

# 4. Rodar migrations
docker compose exec laravel.test php artisan migrate

# 5. Rodar seeders
docker compose exec laravel.test php artisan db:seed
```

## 📝 Comandos Úteis

### Verificar Status
```bash
# Docker
docker compose ps

# MySQL local
sudo systemctl status mysql
```

### Ver Logs
```bash
# Docker MySQL
docker compose logs mysql

# Docker Laravel
docker compose logs laravel.test
```

### Testar Conexão
```bash
# Dentro do Docker
docker compose exec laravel.test php artisan tinker
# Depois: DB::connection()->getPdo();

# Localmente
php artisan tinker
# Depois: DB::connection()->getPdo();
```

