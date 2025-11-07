# 🐳 Comandos Docker - Guia Rápido

## 🚀 Início Rápido

### Opção 1: Script Automatizado (Mais Fácil)
```bash
./docker-start.sh
```

### Opção 2: Manual
```bash
# 1. Configurar .env para Docker
./docker-setup-env.sh

# 2. Subir containers
docker compose up -d

# 3. Aguardar MySQL (15 segundos)
sleep 15

# 4. Gerar chave
docker compose exec laravel.test php artisan key:generate

# 5. Instalar dependências
docker compose exec laravel.test composer install
docker compose exec laravel.test npm install

# 6. Rodar migrations e seeders
docker compose exec laravel.test php artisan migrate --force
docker compose exec laravel.test php artisan db:seed --force

# 7. Compilar assets
docker compose exec laravel.test npm run build
```

## 📋 Comandos Essenciais

### Ver Status
```bash
docker compose ps
```

### Ver Logs
```bash
docker compose logs -f laravel.test
```

### Parar
```bash
docker compose down
```

### Parar e Limpar Tudo
```bash
docker compose down -v
```

### Acessar Container
```bash
docker compose exec laravel.test bash
```

### Artisan
```bash
docker compose exec laravel.test php artisan [comando]
```

### NPM
```bash
docker compose exec laravel.test npm [comando]
```

## 🔧 Configuração do .env

**IMPORTANTE:** Para Docker, o `DB_HOST` deve ser `mysql` (não `localhost`):

```env
DB_CONNECTION=mysql
DB_HOST=mysql          # ← Nome do serviço no compose.yaml
DB_PORT=3306
DB_DATABASE=laravel
DB_USERNAME=sail
DB_PASSWORD=password
```

O script `docker-setup-env.sh` ajusta isso automaticamente!

## 🌐 Acessar

- **Aplicação**: http://localhost
- **API**: http://localhost/api
- **Vite Dev**: http://localhost:5173

## 👤 Usuários Padrão (após seed)

- **Admin**: admin@hospital.com / admin123
- **Triagista**: triagista@hospital.com / triagista123
- **Médico**: medico@hospital.com / medico123

