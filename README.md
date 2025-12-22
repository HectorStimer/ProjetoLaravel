# ProjetoLaravel — Sistema de Fila e Triagem (Inertia + React + Laravel)

Este repositório contém uma aplicação Laravel que implementa um sistema de fila e triagem para atendimento (dashboard, triagem, gerenciamento de pacientes e fila de atendimento). O front-end é construído com React usando Inertia.js e Vite. A autenticação é feita com Laravel Fortify (SPA cookie-based) e Sanctum quando necessário.

## Tecnologias principais
 - Backend: PHP 8.4, Laravel 12
 - Frontend: React + TypeScript, Inertia.js, Vite, Tailwind CSS
 - Autenticação: Laravel Fortify (views) + Laravel Sanctum
 - Banco de Dados: MySQL (via migrations)
 - DevOps: Docker (compose), scripts PowerShell fornecidos

## Resumo do que está neste repositório
 - `app/` - controllers, models, middleware e providers (aplicação Laravel)
 - `resources/js` - app React/Inertia, páginas e componentes
 - `database/migrations` - migrations do schema
 - `routes/web.php` - rotas web (Inertia)
 - `routes/api.php` - atualmente desativada (o projeto roda como Inertia-only)
 - `docker-compose.yaml` / `compose.yaml` / scripts Docker - arquivos de orquestração

> Nota: O projeto foi configurado para rodar como uma SPA Inertia (backend + React). As rotas API foram desativadas por padrão para evitar endpoints duplicados. Caso precise reativar a API, restaure `routes/api.php.bak` e ajuste `config/sanctum.php` conforme necessário.

## Quick start — desenvolvimento local

Pré-requisitos locais:
 - PHP (>= 8.2, aqui usamos 8.4)
 - Composer
 - Node.js + npm
 - MySQL (ou rode via Docker)

1) Instale dependências PHP e JavaScript

```powershell
composer install
npm install
```

2) Configure o ambiente

Copie o arquivo de exemplo e edite as variáveis:

```powershell
cp .env.example .env
php artisan key:generate
```

Ajuste `DB_HOST`, `DB_PORT`, `DB_DATABASE`, `DB_USERNAME` e `DB_PASSWORD` no `.env`.

3) Rode migrations

```powershell
php artisan migrate
```

4) Build (dev) do front-end

```powershell
npm run dev
# Em produção ou para testar assets compilados:
npm run build
```

5) Inicie o servidor Laravel

```powershell
php artisan serve
# Acesse http://localhost:8000
```

Se preferir usar Docker, veja a seção abaixo.

## Rodando com Docker

Este projeto contém scripts e um arquivo de compose para facilitar o uso com Docker. Os nomes e comandos podem variar; abaixo um exemplo geral:

```powershell
# Rodar (script existe: docker-start.ps1)
.\docker-start.ps1
# ou manual com docker compose
docker compose -f .\compose.yaml up -d --build
```

Após os containers estarem prontos, execute dentro do container da aplicação:

```bash
composer install --no-dev --optimize-autoloader
php artisan migrate --force
npm ci && npm run build
php artisan config:cache
```

## Testes

O repositório está configurado com Pest/phpunit. Para rodar os testes locais:

```powershell
./vendor/bin/pest
# ou
./vendor/bin/phpunit
```

> Observação: Atualmente faltam testes automatizados cobrindo casos críticos; escreva testes para autenticação, CRUD de pacientes e permissões antes de produção.

## Rotas e autenticação

 - As rotas web (Inertia) estão em `routes/web.php` e usam o middleware `web` (sessions, CSRF).
 - Fortify registra automaticamente as rotas de login/register/password se `Features::registration()` estiver habilitado.
 - `routes/api.php` foi desativada (stub 410). Se você reativá-la, verifique `config/sanctum.php` e `SANCTUM_STATEFUL_DOMAINS` para autenticação cookie-based.

## Migrations e seeds

 - Todas as migrations estão em `database/migrations` (11 arquivos no total). Antes de rodar em produção, prepare backups e revise mudanças de schema.
 - Para popular dados iniciais, implemente seeders e factories e rode `php artisan db:seed`.

## Deploy — pontos importantes

Antes de colocar em produção, confirme:
 - `APP_ENV=production` e `APP_DEBUG=false` no `.env`
 - `php artisan migrate --force` foi executado
 - Assets foram compilados (`npm run build`) e colocados em `public/build`
 - `storage` e `bootstrap/cache` têm permissões corretas
 - `route:cache` só é executado se não houver rotas definidas por closures (mova closure de logout para controller se quiser usar cache de rotas)
 - Configurar backup do banco, monitoramento (Sentry), e deploy automatizado (CI/CD)

## Notas finais

Este projeto está em estado de MVP (funcionalidades básicas implementadas). Ainda recomendo:
 - escrever testes automatizados;
 - criar seeders para dados de teste;
 - adicionar monitoramento e backups antes de produção.

****

