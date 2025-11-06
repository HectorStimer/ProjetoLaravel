# 🐳 Guia: Como Rodar o Projeto no Docker

Este projeto usa **Laravel Sail**, a solução oficial do Laravel para Docker.

---

## 📋 Pré-requisitos

- **Docker Desktop** instalado e rodando
- **Git** (opcional, para clonar o projeto)

---

## 🚀 Passo a Passo

### 1. Configurar o arquivo `.env`

Crie um arquivo `.env` na raiz do projeto (se não existir) com as seguintes configurações:

```env
APP_NAME="Sistema de Fila Médica"
APP_ENV=local
APP_KEY=
APP_DEBUG=true
APP_TIMEZONE=UTC
APP_URL=http://localhost

APP_LOCALE=pt_BR
APP_FALLBACK_LOCALE=pt_BR
APP_FAKER_LOCALE=pt_BR

APP_MAINTENANCE_DRIVER=file
APP_MAINTENANCE_STORE=database

BCRYPT_ROUNDS=12

LOG_CHANNEL=stack
LOG_STACK=single
LOG_DEPRECATIONS_CHANNEL=null
LOG_LEVEL=debug

DB_CONNECTION=mysql
DB_HOST=mysql
DB_PORT=3306
DB_DATABASE=laravel
DB_USERNAME=sail
DB_PASSWORD=password

SESSION_DRIVER=database
SESSION_LIFETIME=120
SESSION_ENCRYPT=false
SESSION_PATH=/
SESSION_DOMAIN=null

BROADCAST_CONNECTION=log
FILESYSTEM_DISK=local
QUEUE_CONNECTION=database

CACHE_STORE=database
CACHE_PREFIX=

MEMCACHED_HOST=memcached

REDIS_CLIENT=phpredis
REDIS_HOST=redis
REDIS_PASSWORD=null
REDIS_PORT=6379

MAIL_MAILER=log
MAIL_HOST=127.0.0.1
MAIL_PORT=2525
MAIL_USERNAME=null
MAIL_PASSWORD=null
MAIL_ENCRYPTION=null
MAIL_FROM_ADDRESS="hello@example.com"
MAIL_FROM_NAME="${APP_NAME}"

VITE_APP_NAME="${APP_NAME}"
```

### 2. Instalar dependências (se necessário)

Se você ainda não instalou as dependências do Composer localmente, pode fazer isso agora ou pular para o passo 3 (Sail fará isso automaticamente).

### 3. Subir os containers Docker

**Windows (PowerShell):**
```powershell
# Usando Docker Compose diretamente
docker compose up -d

# OU usando Laravel Sail (se tiver instalado)
./vendor/bin/sail up -d
```

**Linux/Mac:**
```bash
# Usando Docker Compose diretamente
docker compose up -d

# OU usando Laravel Sail
./vendor/bin/sail up -d
```

### 4. Gerar a chave da aplicação

```bash
# Windows (PowerShell)
docker compose exec laravel.test php artisan key:generate

# Linux/Mac
docker compose exec laravel.test php artisan key:generate
```

### 5. Instalar dependências do Composer (dentro do container)

```bash
# Windows (PowerShell)
docker compose exec laravel.test composer install

# Linux/Mac
docker compose exec laravel.test composer install
```

### 6. Instalar dependências do NPM (dentro do container)

```bash
# Windows (PowerShell)
docker compose exec laravel.test npm install

# Linux/Mac
docker compose exec laravel.test npm install
```

### 7. Rodar as migrations

```bash
# Windows (PowerShell)
docker compose exec laravel.test php artisan migrate

# Linux/Mac
docker compose exec laravel.test php artisan migrate
```

### 8. Rodar os seeders (opcional - dados iniciais)

```bash
# Windows (PowerShell)
docker compose exec laravel.test php artisan db:seed

# Linux/Mac
docker compose exec laravel.test php artisan db:seed
```

### 9. Compilar os assets do frontend

```bash
# Windows (PowerShell)
docker compose exec laravel.test npm run build

# Linux/Mac
docker compose exec laravel.test npm run build
```

### 10. Acessar a aplicação

Abra seu navegador e acesse:
- **Aplicação:** http://localhost
- **Vite Dev Server (se rodar em dev):** http://localhost:5173

---

## 🛠️ Comandos Úteis

### Parar os containers
```bash
docker compose down
```

### Parar e remover volumes (limpar tudo)
```bash
docker compose down -v
```

### Ver logs
```bash
docker compose logs -f laravel.test
```

### Executar comandos Artisan
```bash
# Windows
docker compose exec laravel.test php artisan [comando]

# Exemplo: criar controller
docker compose exec laravel.test php artisan make:controller TestController
```

### Executar comandos NPM
```bash
# Windows
docker compose exec laravel.test npm [comando]

# Exemplo: rodar em modo dev
docker compose exec laravel.test npm run dev
```

### Acessar o container (shell)
```bash
# Windows
docker compose exec laravel.test bash

# Linux/Mac
docker compose exec laravel.test bash
```

### Acessar o MySQL
```bash
# Windows
docker compose exec mysql mysql -u sail -ppassword laravel

# Linux/Mac
docker compose exec mysql mysql -u sail -ppassword laravel
```

---

## 🔧 Usando Laravel Sail (Alternativa)

Se preferir usar o alias `sail`:

### Windows (PowerShell)
```powershell
# Criar alias
function sail { docker compose exec laravel.test "$@" }

# Agora pode usar:
sail php artisan migrate
sail npm install
sail composer install
```

### Linux/Mac
```bash
# Adicionar ao ~/.bashrc ou ~/.zshrc
alias sail='./vendor/bin/sail'

# Agora pode usar:
sail up -d
sail php artisan migrate
sail npm install
```

---

## 🐛 Solução de Problemas

### Erro: "Port already in use"
Se a porta 80 ou 3306 já estiver em uso, altere no `.env`:
```env
APP_PORT=8080
FORWARD_DB_PORT=3307
```

E atualize o `compose.yaml` se necessário.

### Erro: "Permission denied"
No Linux/Mac, pode ser necessário ajustar permissões:
```bash
sudo chown -R $USER:$USER .
```

### Limpar tudo e começar do zero
```bash
# Parar containers
docker compose down -v

# Remover imagens
docker compose down --rmi all

# Limpar cache do Docker
docker system prune -a

# Subir novamente
docker compose up -d
```

### Rebuild dos containers
```bash
docker compose build --no-cache
docker compose up -d
```

---

## 📝 Variáveis Importantes no `.env`

- `APP_PORT`: Porta da aplicação (padrão: 80)
- `VITE_PORT`: Porta do Vite dev server (padrão: 5173)
- `DB_DATABASE`: Nome do banco de dados
- `DB_USERNAME`: Usuário do MySQL
- `DB_PASSWORD`: Senha do MySQL
- `FORWARD_DB_PORT`: Porta do MySQL no host (padrão: 3306)

---

## ✅ Checklist de Verificação

- [ ] Docker Desktop está rodando
- [ ] Arquivo `.env` configurado
- [ ] Containers estão rodando (`docker compose ps`)
- [ ] Chave da aplicação gerada
- [ ] Dependências instaladas (Composer e NPM)
- [ ] Migrations rodadas
- [ ] Assets compilados
- [ ] Aplicação acessível em http://localhost

---

## 🎯 Próximos Passos

1. Criar um usuário admin:
```bash
docker compose exec laravel.test php artisan tinker
# Depois no tinker:
User::create(['name' => 'Admin', 'email' => 'admin@test.com', 'password' => bcrypt('password'), 'function' => 'admin']);
```

2. Acessar http://localhost e fazer login

3. Começar a usar o sistema! 🚀

---

**Dúvidas?** Consulte a [documentação oficial do Laravel Sail](https://laravel.com/docs/sail).

