# Guia de Setup do Projeto

## 📋 Pré-requisitos

- PHP >= 8.2
- Composer
- Node.js e npm
- MySQL/MariaDB (ou SQLite para desenvolvimento)
- Extensões PHP: pdo, pdo_mysql, mbstring, openssl, tokenizer, xml, ctype, json

## 🚀 Passos para Rodar o Projeto

### 1. Instalar Dependências PHP

```bash
composer install
```

### 2. Configurar Ambiente

O arquivo `.env` já existe. Verifique se as configurações estão corretas:

```bash
# Para MySQL/MariaDB
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=nome_do_banco
DB_USERNAME=seu_usuario
DB_PASSWORD=sua_senha

# OU para SQLite (desenvolvimento)
DB_CONNECTION=sqlite
DB_DATABASE=/caminho/para/database/database.sqlite
```

**Nota:** Se usar SQLite, crie o arquivo:
```bash
touch database/database.sqlite
```

### 3. Gerar Chave da Aplicação (se necessário)

```bash
php artisan key:generate
```

### 4. Criar Banco de Dados

**Para MySQL:**
```bash
mysql -u root -p
CREATE DATABASE nome_do_banco CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

**Para SQLite:**
```bash
touch database/database.sqlite
```

### 5. Rodar Migrations

```bash
php artisan migrate
```

Isso criará todas as tabelas necessárias:
- users
- patients
- services
- queue_entries
- triages
- cache
- jobs

### 6. Popular Banco com Dados Iniciais

```bash
php artisan db:seed
```

Isso criará:
- 5 serviços padrão (Consulta Médica, Triagem, etc.)
- 3 usuários padrão:
  - **Admin**: admin@hospital.com / admin123
  - **Triagista**: triagista@hospital.com / triagista123
  - **Médico**: medico@hospital.com / medico123

### 7. Instalar Dependências Frontend

```bash
npm install
```

### 8. Compilar Assets Frontend

**Para desenvolvimento:**
```bash
npm run dev
```

**Para produção:**
```bash
npm run build
```

### 9. Iniciar Servidor

**Opção 1: Servidor PHP Built-in**
```bash
php artisan serve
```
Acesse: http://localhost:8000

**Opção 2: Usando o script do composer (com queue e vite)**
```bash
composer dev
```

## 🔧 Configurações Importantes

### Sanctum (API Authentication)

O Sanctum já está configurado. As rotas da API estão protegidas com `auth:sanctum`.

### Rotas da API

Todas as rotas da API estão em `/api/*`:

- **Autenticação**: `/api/register`, `/api/login`, `/api/logout`
- **Pacientes**: `/api/patients`
- **Serviços**: `/api/services`
- **Triagem**: `/api/triage`
- **Fila**: `/api/queue`
- **Dashboards**: `/api/dashboard/admin`, `/api/dashboard/triagist`, `/api/dashboard/doctor`

### Testando a API

**1. Registrar um usuário:**
```bash
curl -X POST http://localhost:8000/api/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Teste",
    "email": "teste@teste.com",
    "password": "password123",
    "password_confirmation": "password123",
    "function": "admin"
  }'
```

**2. Fazer login:**
```bash
curl -X POST http://localhost:8000/api/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@hospital.com",
    "password": "admin123"
  }'
```

**3. Usar token nas requisições:**
```bash
curl -X GET http://localhost:8000/api/patients \
  -H "Authorization: Bearer SEU_TOKEN_AQUI"
```

## ⚠️ Problemas Comuns

### Erro: "SQLSTATE[HY000] [2002] No such file or directory"
- Verifique se o MySQL está rodando
- Verifique as credenciais no `.env`

### Erro: "Class 'App\Http\Controllers\Api\QueueController' not found"
- Execute: `composer dump-autoload`

### Erro: "The stream or file could not be opened"
- Verifique permissões: `chmod -R 775 storage bootstrap/cache`

### Migration já existe
- Se precisar resetar: `php artisan migrate:fresh --seed`

## 📝 Próximos Passos

1. ✅ Backend está funcional
2. ⏳ Frontend precisa ser integrado
3. ⏳ Criar páginas Inertia.js para cada funcionalidade
4. ⏳ Implementar autenticação no frontend
5. ⏳ Testes automatizados

## 🎯 Status do Projeto

- ✅ Backend API completo
- ✅ Migrations criadas
- ✅ Seeders implementados
- ✅ Controllers funcionais
- ✅ Autenticação com Sanctum
- ⏳ Frontend (em desenvolvimento)

