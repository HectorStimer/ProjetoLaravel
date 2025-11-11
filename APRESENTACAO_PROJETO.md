# 📊 APRESENTAÇÃO DO PROJETO - SISTEMA DE FILA DE ATENDIMENTO

## 🎯 OBJETIVO DO PROJETO

Sistema web/mobile para gerenciar filas de atendimento em hospitais e clínicas, com:
- Controle de pacientes
- Avaliação de triagem (priorização)
- Gestão de fila por serviço/departamento
- Controle de atendimento por médicos
- Dashboard com estatísticas

---

## 🏗️ ARQUITETURA GERAL

```
┌─────────────────────────────────────────────────────────┐
│                    USUÁRIO FINAL                         │
│              (Web/Mobile - React/Inertia)                │
└──────────────────────┬──────────────────────────────────┘
                       │
                       ├─── FORTIFY (Autenticação Web)
                       ├─── SANCTUM (Autenticação API)
                       │
┌──────────────────────▼──────────────────────────────────┐
│           LARAVEL 12 (Backend)                           │
│  ┌────────────────────────────────────────────────┐    │
│  │  Controllers (Lógica de Negócio)               │    │
│  │  Models (Dados e Relacionamentos)              │    │
│  │  Migrations (Banco de Dados)                   │    │
│  │  Middleware (Autorização por Role)             │    │
│  └────────────────────────────────────────────────┘    │
│                       │                                  │
└──────────────────────┬──────────────────────────────────┘
                       │
┌──────────────────────▼──────────────────────────────────┐
│           BANCO DE DADOS (MySQL/PostgreSQL)              │
│  users | patients | services | queue_entries | triages  │
└──────────────────────────────────────────────────────────┘
```

---

## 👥 ESTRUTURA DE USUÁRIOS (ROLES)

```
┌─────────────────────────────────────────────────────────┐
│                       ADMIN                              │
│  • Criar/editar/deletar serviços                        │
│  • Ver todos os dashboards                              │
│  • Controle total do sistema                            │
└─────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────┐
│                      TRIAGIST                            │
│  • Registrar novos pacientes                            │
│  • Fazer avaliação de triagem                           │
│  • Adicionar pacientes na fila                          │
│  • Cancelar pacientes da fila                           │
└─────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────┐
│                      DOCTOR                              │
│  • Chamar próximo paciente                              │
│  • Iniciar atendimento                                  │
│  • Finalizar atendimento                                │
│  • Ver fila do seu serviço                              │
└─────────────────────────────────────────────────────────┘
```

---

## 📁 ESTRUTURA DE PASTAS

### `/app` - Aplicação

```
app/
├── Http/
│   ├── Controllers/
│   │   ├── Api/
│   │   │   ├── AuthController.php        🔐 Autenticação (login/register)
│   │   │   ├── PatientController.php     👤 Gestão de pacientes
│   │   │   ├── QueueController.php       📋 Controle da fila
│   │   │   ├── TriageController.php      🏥 Avaliação de triagem
│   │   │   ├── ServiceController.php     🔧 Gestão de serviços/departamentos
│   │   │   └── DashboardController.php   📊 Estatísticas
│   │   │
│   │   └── (Outros controllers)
│   │
│   └── Middleware/
│       ├── ApiAuth.php                   ✅ Autenticação (sessão + token)
│       ├── EnsureUserIsAdmin.php         🛡️ Valida se é admin
│       ├── EnsureUserIsTriagist.php      🛡️ Valida se é triagista
│       └── EnsureUserIsDoctor.php        🛡️ Valida se é médico
│
├── Models/
│   ├── User.php                          👤 Usuários com roles
│   ├── Patient.php                       🏥 Dados do paciente
│   ├── QueueEntry.php                    📋 Entrada na fila
│   ├── Triage.php                        📊 Avaliação de triagem
│   └── Service.php                       🔧 Serviços/Departamentos
│
└── Providers/
    ├── AppServiceProvider.php
    └── FortifyServiceProvider.php        🔐 Config autenticação
```

### `/database` - Banco de Dados

```
database/
├── migrations/
│   ├── 0001_01_01_000000_create_users_table.php
│   ├── 2025_10_21_225525_create_services_table.php
│   ├── 2025_10_21_225526_create_patients_table.php
│   ├── 2025_10_21_225629_create_queue_entries_table.php
│   ├── 2025_10_21_225644_create_triages_table.php
│   └── 2025_11_11_*_add_corrections.php  ← NOVAS (correções)
│
├── factories/
│   └── UserFactory.php                   🎲 Gera dados fake
│
└── seeders/
    └── DatabaseSeeder.php                🌱 Popula BD inicialmente
```

### `/routes` - Rotas da API

```
routes/
├── api.php                               🛣️ Todas as rotas REST
├── web.php                               🌐 Rotas web (Inertia)
├── console.php                           💻 Comandos CLI
└── settings.php                          ⚙️ Configurações
```

### `/config` - Configuração

```
config/
├── app.php                               Configuração geral
├── auth.php                              Autenticação (guards)
├── database.php                          Banco de dados
├── cache.php                             Cache
├── fortify.php                           🔐 Fortify (web auth)
├── sanctum.php                           🔐 Sanctum (API auth)
└── ...outros
```

### `/resources` - Frontend

```
resources/
├── js/                                   ⚛️ Componentes React
│   ├── Pages/
│   │   ├── Dashboard/
│   │   ├── Patients/
│   │   ├── Queue/
│   │   └── ...
│   └── Components/
│       ├── Navigation.jsx
│       ├── PatientForm.jsx
│       └── ...
│
└── css/                                  🎨 Tailwind CSS
    ├── app.css
    └── ...
```

### `/public` - Arquivos Estáticos

```
public/
├── index.php                             Entry point do app
├── robots.txt
└── build/                                Assets compilados (Vite)
    ├── app.js
    ├── app.css
    └── ...
```

---

## 🗄️ ESTRUTURA DO BANCO DE DADOS

### Tabela: `users`
```sql
id              | bigint (PK)
name            | string
email           | string (UNIQUE)
password        | string
function        | enum (admin, triagist, doctor)  ← NOVO
created_at      | timestamp
updated_at      | timestamp
```

### Tabela: `services`
```sql
id                        | bigint (PK)
name                      | string (ex: "Cardiologia")
avg_service_time_minutes  | integer
created_at                | timestamp
updated_at                | timestamp
```

### Tabela: `patients`
```sql
id          | bigint (PK)
name        | string
document    | string (UNIQUE, nullable)
birth_date  | date
phone       | string (nullable)
created_by  | bigint (FK → users.id)  ← CORRIGIDO
created_at  | timestamp
updated_at  | timestamp
```

### Tabela: `triages`
```sql
id           | bigint (PK)
patient_id   | bigint (FK → patients.id)
triagist_id  | bigint (FK → users.id)
score        | tinyint (1-5)
notes        | text (nullable)
created_at   | timestamp
updated_at   | timestamp
```

### Tabela: `queue_entries`
```sql
id                    | bigint (PK)
patient_id            | bigint (FK → patients.id)
service_id            | bigint (FK → services.id)
status                | enum (waiting, called, in_service, canceled, finished)
priority              | integer (1-5, onde 1=urgente)
created_by            | bigint (FK → users.id)  ← NOVO
arrived_at            | timestamp
called_at             | timestamp (nullable)
started_at            | timestamp (nullable)
finished_at           | timestamp (nullable)
estimated_service_time| integer (nullable, em minutos)
created_at            | timestamp
updated_at            | timestamp
```

---

## 🔄 FLUXO DE DADOS (CASO DE USO)

### 1️⃣ PACIENTE CHEGA NA CLÍNICA

```
┌──────────────────┐
│  Paciente Chega  │
└────────┬─────────┘
         │
         ▼
┌──────────────────────────────┐
│  Triagista registra paciente │
│  POST /api/patients          │
│  - Nome                      │
│  - Data nascimento           │
│  - Documento                 │
│  - Telefone                  │
└────────┬─────────────────────┘
         │
         ▼
┌──────────────────────────────┐
│  Sistema cria Patient        │
│  (created_by = triagista)    │
└────────┬─────────────────────┘
         │
         ▼
┌──────────────────────────────┐
│  Triagista faz triagem       │
│  POST /api/triage            │
│  - Score (1-5)              │
│  - Notas clínicas           │
│  - Serviço necessário       │
└────────┬─────────────────────┘
         │
         ▼
┌──────────────────────────────┐
│  Sistema cria Triage Record  │
│  + Adiciona paciente na fila │
│  (QueueEntry criado)         │
└────────┬─────────────────────┘
         │
         ▼
┌──────────────────────────────┐
│  Paciente aguarda na fila    │
│  (status: waiting)           │
│  Priorizado por score        │
└──────────────────────────────┘
```

### 2️⃣ MÉDICO CHAMA PACIENTE

```
┌──────────────────────────────┐
│  Médico vê próximo paciente  │
│  GET /api/queue/next         │
└────────┬─────────────────────┘
         │
         ▼
┌──────────────────────────────┐
│  Médico clica "Chamar"       │
│  POST /api/queue/{id}/call   │
└────────┬─────────────────────┘
         │
         ▼
┌──────────────────────────────┐
│  Sistema muda status         │
│  waiting → called            │
│  called_at = now()           │
└────────┬─────────────────────┘
         │
         ▼
┌──────────────────────────────┐
│  Paciente entra na sala      │
│  Médico clica "Iniciar"      │
│  POST /api/queue/{id}/start  │
└────────┬─────────────────────┘
         │
         ▼
┌──────────────────────────────┐
│  Sistema muda status         │
│  called → in_service         │
│  started_at = now()          │
└────────┬─────────────────────┘
         │
         ▼
┌──────────────────────────────┐
│  Médico finaliza atendimento │
│  POST /api/queue/{id}/finish │
└────────┬─────────────────────┘
         │
         ▼
┌──────────────────────────────┐
│  Sistema muda status         │
│  in_service → finished       │
│  finished_at = now()         │
└────────┬─────────────────────┘
         │
         ▼
┌──────────────────────────────┐
│  Paciente sai do sistema     │
│  Próximo paciente é chamado  │
└──────────────────────────────┘
```

---

## 🛣️ PRINCIPAIS ROTAS DA API

### 🔐 AUTENTICAÇÃO
```
POST   /api/register              Registrar novo usuário
POST   /api/login                 Login
POST   /api/logout                Logout (requer auth)
```

### 👤 PACIENTES
```
GET    /api/patients              Listar todos os pacientes
POST   /api/patients              Criar novo paciente (triagista+)
GET    /api/patients/{id}         Ver detalhes do paciente
PUT    /api/patients/{id}         Atualizar paciente (triagista+)
DELETE /api/patients/{id}         Deletar paciente (admin)
```

### 📊 TRIAGEM
```
POST   /api/triage                Criar triagem (triagista)
GET    /api/triage/{patient_id}   Ver triagem do paciente
```

### 🔧 SERVIÇOS
```
GET    /api/services              Listar serviços
POST   /api/services              Criar serviço (admin)
GET    /api/services/{id}         Ver detalhes
PUT    /api/services/{id}         Atualizar (admin)
DELETE /api/services/{id}         Deletar (admin)
```

### 📋 FILA
```
GET    /api/queue                 Ver fila atual
POST   /api/queue/enqueue         Adicionar paciente na fila (triagista)
GET    /api/queue/next            Próximo paciente (médico)
POST   /api/queue/{id}/call       Chamar paciente (médico)
POST   /api/queue/{id}/start      Iniciar atendimento (médico)
POST   /api/queue/{id}/finish     Finalizar atendimento (médico)
POST   /api/queue/{id}/cancel     Cancelar paciente (triagista)
GET    /api/queue/screening       Fila de triagem (triagista)
```

### 📊 DASHBOARDS
```
GET    /api/dashboard/admin       Dashboard do admin
GET    /api/dashboard/triagist    Dashboard do triagista
GET    /api/dashboard/doctor      Dashboard do médico
GET    /api/dashboard/summary     Estatísticas gerais
GET    /api/dashboard/stats/status     Status da fila
GET    /api/dashboard/stats/services   Estatísticas por serviço
GET    /api/dashboard/stats/daily      Estatísticas diárias
```

---

## 🔐 SEGURANÇA & AUTORIZAÇÃO

### Middleware de Roles
```
ApiAuth
├─→ Valida se usuário tem sessão (web) OU token (API)
│
EnsureUserIsAdmin
├─→ Valida se user.function === 'admin'
│
EnsureUserIsTriagist
├─→ Valida se user.function === 'triagist' OU admin
│
EnsureUserIsDoctor
└─→ Valida se user.function === 'doctor' OU admin
```

### Exemplo de Uso
```php
// Na rota:
Route::post('/patients', [PatientController::class, 'store'])
    ->middleware(\App\Http\Middleware\EnsureUserIsTriagist::class);

// Apenas triagistas (e admins) podem criar pacientes
```

---

## 🎯 PRINCIPAIS CLASSES

### AuthController
```php
register()   // Cria novo usuário com função
login()      // Login via email/password
logout()     // Revoga tokens
```

### PatientController
```php
index()      // Lista pacientes
store()      // Cria novo paciente
show()       // Ver detalhes
update()     // Atualizar dados
destroy()    // Deletar paciente
```

### QueueController
```php
index()              // Ver fila atual
enqueue()            // Adicionar na fila
call()               // Chamar paciente
start()              // Iniciar atendimento
finish()             // Finalizar atendimento
nextPatient()        // Próximo paciente
getQueueForScreening()  // Fila de triagem
```

### TriageController
```php
store()      // Criar triagem
showByPatient()  // Ver triagem do paciente
update()     // Atualizar triagem
destroy()    // Deletar triagem
```

### ServiceController
```php
index()      // Listar serviços
store()      // Criar novo serviço
show()       // Ver detalhes
update()     // Atualizar serviço
destroy()    // Deletar serviço
```

---

## 📊 RELACIONAMENTOS ENTRE MODELOS

```
User
├── hasMany(Triage)        [triagist_id]
├── hasMany(QueueEntry)    [created_by]
├── hasMany(Patient)       [created_by]
└── hasMany(Token)         [Sanctum]

Patient
├── belongsTo(User)        [created_by]
├── hasMany(Triage)        [patient_id]
└── hasMany(QueueEntry)    [patient_id]

Triage
├── belongsTo(Patient)     [patient_id]
└── belongsTo(User)        [triagist_id]

Service
└── hasMany(QueueEntry)    [service_id]

QueueEntry
├── belongsTo(Patient)     [patient_id]
├── belongsTo(Service)     [service_id]
└── belongsTo(User)        [created_by]
```

---

## 🚀 STACK TECNOLÓGICO

### Backend
- **Laravel 12** - Framework PHP moderno
- **Sanctum** - Autenticação API via token
- **Fortify** - Autenticação web (login/register)
- **Eloquent** - ORM para banco de dados
- **MySQL/PostgreSQL** - Banco de dados

### Frontend
- **React 19** - Library para UI
- **Inertia.js** - Integração React + Laravel
- **Tailwind CSS** - Framework CSS
- **Vite** - Build tool moderno

### Extras
- **Docker** - Containerização
- **Pest** - Framework de testes

---

## 💾 COMO FUNCIONA O BANCO

### Fluxo de Dados no Banco

```
USER REGISTRATION
├─ POST /api/register
├─ Cria registro em users
│  └─ id, name, email, password, function
└─ Retorna token de autenticação

PATIENT CREATION
├─ POST /api/patients (triagista autenticado)
├─ Cria registro em patients
│  └─ id, name, document, birth_date, phone, created_by (FK → users.id)
└─ Retorna dados do paciente

TRIAGE CREATION
├─ POST /api/triage (triagista autenticado)
├─ Cria registro em triages
│  └─ id, patient_id (FK), triagist_id (FK), score, notes
├─ Cria/atualiza registro em queue_entries
│  └─ id, patient_id (FK), service_id (FK), priority, status, created_by (FK), arrived_at
└─ Retorna dados da triagem

QUEUE MANAGEMENT
├─ GET /api/queue
│  └─ Retorna entries onde status IN (waiting, called, in_service)
├─ POST /api/queue/{id}/call
│  └─ Atualiza status: waiting → called, called_at = now()
├─ POST /api/queue/{id}/start
│  └─ Atualiza status: called → in_service, started_at = now()
└─ POST /api/queue/{id}/finish
   └─ Atualiza status: in_service → finished, finished_at = now()
```

---

## ⚠️ CORREÇÕES IMPLEMENTADAS (11/11/2025)

### Problema 1: Coluna `function` não existia
**Solução:** Migration criada para adicionar coluna enum

### Problema 2: Foreign Key `created_by` em patients era string
**Solução:** Migration criada para converter em FK relacionada a users

### Problema 3: Service ID hardcoded em triagem
**Solução:** TriageController agora permite seleção de serviço

### Problema 4: Validação fraca em update de pacientes
**Solução:** Adicionada validação robusta com regras

### Problema 5: Falta de relacionamento em Patient model
**Solução:** Adicionado método `createdBy()`

---

## 📈 FLUXO DE USO TÍPICO

### Dia 1: Setup Inicial
1. Admin cria usuários (triagistas e médicos)
2. Admin cria serviços (departamentos)
3. Sistema está pronto!

### Dia 2+: Operação Normal
1. **08h00** - Clínica abre
2. **08h15** - Primeiro paciente chega
   - Triagista registra → cria Patient
   - Triagista faz triagem → cria Triage + QueueEntry
3. **08h30** - Médico começa atender
   - Vê fila do seu serviço
   - Clica "Chamar" → status = called
   - Paciente entra na sala
   - Clica "Iniciar" → status = in_service
4. **09h00** - Médico termina atendimento
   - Clica "Finalizar" → status = finished
5. **09h05** - Próximo paciente é chamado automaticamente
6. **18h00** - Clínica fecha
   - Admin vê relatórios no dashboard

---

## 🎓 CONCLUSÃO

Este é um sistema robusto e escalável para gerenciar filas de atendimento com:

✅ **Autenticação dupla** (web + API)
✅ **Controle de acesso** por role (admin, triagist, doctor)
✅ **Banco de dados** bem estruturado com FKs
✅ **Validações** robustas
✅ **Relacionamentos** bem definidos
✅ **API RESTful** completa
✅ **Frontend moderno** com React
✅ **Rastreabilidade** completa de ações

**Status:** ✅ **PRONTO PARA PRODUÇÃO**

---

**Documento gerado em:** 11 de Novembro de 2025
**Versão:** 1.0
**Para:** Apresentação do Projeto
