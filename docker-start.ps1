# Script de Inicialização Docker - Windows PowerShell
# Execute: .\docker-start.ps1

Write-Host "🐳 Iniciando containers Docker..." -ForegroundColor Cyan

# Verificar se Docker está rodando
$dockerRunning = docker info 2>&1
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Docker não está rodando! Inicie o Docker Desktop primeiro." -ForegroundColor Red
    exit 1
}

# Verificar se .env existe
if (-not (Test-Path .env)) {
    Write-Host "⚠️  Arquivo .env não encontrado. Criando a partir do exemplo..." -ForegroundColor Yellow
    if (Test-Path .env.example) {
        Copy-Item .env.example .env
    } else {
        Write-Host "❌ Arquivo .env.example não encontrado. Crie o arquivo .env manualmente." -ForegroundColor Red
        exit 1
    }
}

# Subir containers
Write-Host "📦 Subindo containers..." -ForegroundColor Cyan
docker compose up -d

if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Erro ao subir containers!" -ForegroundColor Red
    exit 1
}

# Aguardar containers ficarem prontos
Write-Host "⏳ Aguardando containers ficarem prontos..." -ForegroundColor Cyan
Start-Sleep -Seconds 10

# Gerar chave da aplicação
Write-Host "🔑 Gerando chave da aplicação..." -ForegroundColor Cyan
docker compose exec -T laravel.test php artisan key:generate

# Instalar dependências Composer
Write-Host "📥 Instalando dependências do Composer..." -ForegroundColor Cyan
docker compose exec -T laravel.test composer install

# Instalar dependências NPM
Write-Host "📦 Instalando dependências do NPM..." -ForegroundColor Cyan
docker compose exec -T laravel.test npm install

# Rodar migrations
Write-Host "🗄️  Rodando migrations..." -ForegroundColor Cyan
docker compose exec -T laravel.test php artisan migrate --force

# Rodar seeders
Write-Host "🌱 Rodando seeders..." -ForegroundColor Cyan
docker compose exec -T laravel.test php artisan db:seed --force

# Compilar assets
Write-Host "🎨 Compilando assets..." -ForegroundColor Cyan
docker compose exec -T laravel.test npm run build

Write-Host ""
Write-Host "✅ Pronto! Aplicação rodando em http://localhost" -ForegroundColor Green
Write-Host ""
Write-Host "📝 Comandos úteis:" -ForegroundColor Yellow
Write-Host "  - Ver logs: docker compose logs -f laravel.test"
Write-Host "  - Parar: docker compose down"
Write-Host "  - Acessar container: docker compose exec laravel.test bash"
Write-Host ""

