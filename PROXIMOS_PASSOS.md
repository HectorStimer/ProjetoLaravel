# 🚀 Próximos Passos - Plano de Ação para MVP

## 📋 Visão Geral

Este documento detalha os próximos passos priorizados para levar o projeto ao MVP funcional. Siga a ordem sugerida para maximizar a eficiência.

---

## 🎯 FASE 1: Completar Backend (Prioridade ALTA)

### 1.1 Criar ServiceController
**Tempo estimado: 1-2 horas**

**O que fazer:**
- Criar `app/Http/Controllers/Api/ServiceController.php`
- Implementar métodos: `index()`, `store()`, `show()`, `update()`, `destroy()`
- Adicionar validações apropriadas

**Arquivos a criar/modificar:**
- `app/Http/Controllers/Api/ServiceController.php` (novo)
- `routes/api.php` (adicionar rotas)

**Rotas necessárias:**
```php
Route::get('/services', [ServiceController::class, 'index']);
Route::post('/services', [ServiceController::class, 'store']);
Route::get('/services/{id}', [ServiceController::class, 'show']);
Route::put('/services/{id}', [ServiceController::class, 'update']);
Route::delete('/services/{id}', [ServiceController::class, 'destroy']);
```

### 1.2 Criar Seeders
**Tempo estimado: 1 hora**

**O que fazer:**
- Criar `database/seeders/ServiceSeeder.php` com serviços básicos
- Criar `database/seeders/UserSeeder.php` com usuários de exemplo
- Atualizar `DatabaseSeeder.php`

**Serviços sugeridos:**
- Consulta Médica
- Triagem
- Exames
- Atendimento de Urgência

---

## 🎨 FASE 2: Configurar Frontend Base (Prioridade ALTA)

### 2.1 Configurar Cliente HTTP
**Tempo estimado: 30 minutos**

**O que fazer:**
- Instalar axios (se necessário)
- Criar arquivo de configuração da API
- Configurar interceptors para autenticação

**Arquivos a criar:**
- `resources/js/lib/api.ts` ou `resources/js/services/api.ts`

**Exemplo de estrutura:**
```typescript
// Configurar baseURL, headers, interceptors
// Adicionar token de autenticação automaticamente
// Tratamento de erros global
```

### 2.2 Criar Hooks Úteis
**Tempo estimado: 1 hora**

**O que fazer:**
- Criar hook `useApi` para chamadas API
- Criar hook `useAuth` para gerenciar autenticação
- Criar hook `useQueue` para operações de fila

**Arquivos a criar:**
- `resources/js/hooks/use-api.ts`
- `resources/js/hooks/use-auth.ts`
- `resources/js/hooks/use-queue.ts`

---

## 📄 FASE 3: Páginas Core - Pacientes (Prioridade ALTA)

### 3.1 Listagem de Pacientes
**Tempo estimado: 2-3 horas**

**O que fazer:**
- Criar página `resources/js/pages/patients/index.tsx`
- Criar componente de tabela de pacientes
- Implementar busca e filtros
- Adicionar rota em `routes/web.php`

**Funcionalidades:**
- Listar todos os pacientes
- Buscar por nome/documento
- Visualizar detalhes
- Botão para adicionar novo paciente

### 3.2 Formulário de Paciente
**Tempo estimado: 2-3 horas**

**O que fazer:**
- Criar página `resources/js/pages/patients/create.tsx`
- Criar página `resources/js/pages/patients/edit.tsx`
- Criar componente de formulário reutilizável
- Validações frontend

**Campos do formulário:**
- Nome (obrigatório)
- Documento (opcional, único)
- Data de nascimento (obrigatório)
- Telefone (opcional)

### 3.3 Visualização de Paciente
**Tempo estimado: 1-2 horas**

**O que fazer:**
- Criar página `resources/js/pages/patients/show.tsx`
- Mostrar informações do paciente
- Histórico de triagens
- Histórico de atendimentos na fila

---

## 🏥 FASE 4: Páginas Core - Fila (Prioridade ALTA)

### 4.1 Visualização da Fila
**Tempo estimado: 3-4 horas**

**O que fazer:**
- Criar página `resources/js/pages/queue/index.tsx`
- Componente de lista de fila em tempo real
- Atualização automática (polling ou websocket)
- Filtros por status e serviço

**Funcionalidades:**
- Mostrar pacientes em espera
- Mostrar pacientes chamados
- Mostrar pacientes em atendimento
- Ordenação por prioridade

### 4.2 Adicionar à Fila
**Tempo estimado: 2 horas**

**O que fazer:**
- Modal/formulário para adicionar paciente à fila
- Seleção de paciente (busca)
- Seleção de serviço
- Definição de prioridade

### 4.3 Ações da Fila
**Tempo estimado: 2-3 horas**

**O que fazer:**
- Botão "Chamar Próximo"
- Botão "Chamar" (paciente específico)
- Botão "Iniciar Atendimento"
- Botão "Finalizar Atendimento"
- Botão "Cancelar"

**Componentes:**
- `resources/js/components/queue/QueueActions.tsx`
- `resources/js/components/queue/QueueItem.tsx`

---

## 🩺 FASE 5: Páginas Core - Triagem (Prioridade ALTA)

### 5.1 Formulário de Triagem
**Tempo estimado: 2-3 horas**

**O que fazer:**
- Criar página `resources/js/pages/triage/create.tsx`
- Formulário com score (1-5)
- Campo de notas
- Seleção de paciente

**Funcionalidades:**
- Buscar paciente
- Preencher score de triagem
- Adicionar notas
- Salvar e adicionar à fila automaticamente

### 5.2 Listagem de Triagens
**Tempo estimado: 1-2 horas**

**O que fazer:**
- Criar página `resources/js/pages/triage/index.tsx`
- Listar triagens recentes
- Filtros por paciente, triagista, score

---

## 📊 FASE 6: Dashboards por Função (Prioridade MÉDIA)

### 6.1 Dashboard Admin
**Tempo estimado: 3-4 horas**

**O que fazer:**
- Modificar `resources/js/pages/dashboard.tsx`
- Mostrar estatísticas gerais
- Gráficos de status da fila
- Estatísticas de serviços
- Pacientes recentes

**Componentes:**
- Cards de estatísticas
- Gráficos (usar biblioteca como recharts)
- Tabela de pacientes recentes

### 6.2 Dashboard Triagista
**Tempo estimado: 2-3 horas**

**O que fazer:**
- Criar `resources/js/pages/dashboard/triagist.tsx`
- Fila de pacientes para triagem
- Estatísticas de triagens
- Acesso rápido ao formulário de triagem

### 6.3 Dashboard Médico
**Tempo estimado: 2-3 horas**

**O que fazer:**
- Criar `resources/js/pages/dashboard/doctor.tsx`
- Fila atual de atendimento
- Paciente em atendimento
- Ações rápidas (chamar próximo, finalizar)

---

## 🔐 FASE 7: Navegação e Rotas (Prioridade MÉDIA)

### 7.1 Rotas Web
**Tempo estimado: 1-2 horas**

**O que fazer:**
- Adicionar rotas em `routes/web.php`
- Criar controllers Inertia para cada página
- Middleware de autenticação

**Rotas necessárias:**
```php
// Pacientes
Route::get('/patients', [PatientController::class, 'index']);
Route::get('/patients/create', [PatientController::class, 'create']);
Route::get('/patients/{id}', [PatientController::class, 'show']);
Route::get('/patients/{id}/edit', [PatientController::class, 'edit']);

// Fila
Route::get('/queue', [QueueController::class, 'index']);

// Triagem
Route::get('/triage', [TriageController::class, 'index']);
Route::get('/triage/create', [TriageController::class, 'create']);

// Dashboards
Route::get('/dashboard/admin', [DashboardController::class, 'admin']);
Route::get('/dashboard/triagist', [DashboardController::class, 'triagist']);
Route::get('/dashboard/doctor', [DashboardController::class, 'doctor']);
```

### 7.2 Menu de Navegação
**Tempo estimado: 2 horas**

**O que fazer:**
- Modificar `resources/js/components/app-sidebar.tsx`
- Menu dinâmico baseado na função do usuário
- Links para todas as páginas principais

**Itens do menu por função:**
- **Admin**: Dashboard, Pacientes, Fila, Triagens, Serviços, Estatísticas
- **Triagista**: Dashboard, Fila de Triagem, Nova Triagem
- **Médico**: Dashboard, Minha Fila, Atendimentos

### 7.3 Controllers Inertia
**Tempo estimado: 2-3 horas**

**O que fazer:**
- Criar controllers Inertia (não API) para cada página
- Retornar dados necessários para cada view
- Integrar com modelos existentes

**Controllers a criar:**
- `app/Http/Controllers/PatientController.php` (Inertia)
- `app/Http/Controllers/QueueController.php` (Inertia)
- `app/Http/Controllers/TriageController.php` (Inertia)
- `app/Http/Controllers/DashboardController.php` (Inertia)

---

## 🔔 FASE 8: Notificações em Tempo Real (Prioridade MÉDIA)

### 8.1 Configurar Broadcasting
**Tempo estimado: 2-3 horas**

**O que fazer:**
- Configurar Pusher no `.env`
- Implementar eventos de broadcasting
- Atualizar `PatientCalled` event
- Criar listeners

### 8.2 Frontend - WebSockets
**Tempo estimado: 2-3 horas**

**O que fazer:**
- Instalar Laravel Echo
- Configurar conexão WebSocket
- Atualizar fila em tempo real
- Notificações de chamada

---

## 🧪 FASE 9: Testes e Validações (Prioridade BAIXA)

### 9.1 Testes de API
**Tempo estimado: 2-3 horas**

**O que fazer:**
- Testes de endpoints de pacientes
- Testes de endpoints de fila
- Testes de endpoints de triagem

### 9.2 Validações Frontend
**Tempo estimado: 2 horas**

**O que fazer:**
- Validação de formulários
- Mensagens de erro amigáveis
- Confirmações de ações críticas

---

## 📝 Checklist de Implementação

### Backend
- [ ] ServiceController criado
- [ ] Rotas de serviços adicionadas
- [ ] Seeders criados
- [ ] Controllers Inertia criados
- [ ] Rotas web configuradas

### Frontend - Base
- [ ] Cliente HTTP configurado
- [ ] Hooks úteis criados
- [ ] Tipos TypeScript definidos

### Frontend - Pacientes
- [ ] Listagem de pacientes
- [ ] Formulário de criação
- [ ] Formulário de edição
- [ ] Visualização de detalhes

### Frontend - Fila
- [ ] Visualização da fila
- [ ] Adicionar à fila
- [ ] Ações da fila (chamar, iniciar, finalizar)

### Frontend - Triagem
- [ ] Formulário de triagem
- [ ] Listagem de triagens

### Frontend - Dashboards
- [ ] Dashboard Admin
- [ ] Dashboard Triagista
- [ ] Dashboard Médico

### Navegação
- [ ] Menu por função
- [ ] Rotas configuradas
- [ ] Breadcrumbs

### Melhorias
- [ ] Notificações em tempo real
- [ ] Testes básicos
- [ ] Validações

---

## 🎯 Ordem Recomendada de Execução

### Semana 1 (Dias 1-5)
1. **Dia 1**: Fase 1 (Backend completo) + Fase 2 (Config frontend)
2. **Dia 2-3**: Fase 3 (Páginas de Pacientes)
3. **Dia 4-5**: Fase 4 (Páginas de Fila)

### Semana 2 (Dias 6-10)
4. **Dia 6**: Fase 5 (Páginas de Triagem)
5. **Dia 7-8**: Fase 6 (Dashboards)
6. **Dia 9**: Fase 7 (Navegação e Rotas)
7. **Dia 10**: Fase 8 (Notificações) + Ajustes

---

## 💡 Dicas de Implementação

1. **Comece pelo Backend**: Complete o ServiceController primeiro
2. **Uma página por vez**: Implemente completamente cada página antes de passar para a próxima
3. **Teste enquanto desenvolve**: Teste cada funcionalidade assim que implementar
4. **Reutilize componentes**: Crie componentes reutilizáveis desde o início
5. **Use TypeScript**: Defina tipos para todos os dados
6. **Tratamento de erros**: Implemente tratamento de erros desde o início

---

## 🚨 Pontos de Atenção

1. **Autenticação**: Certifique-se de que todas as rotas estão protegidas
2. **Permissões**: Implemente verificação de função do usuário
3. **Performance**: Use paginação nas listagens
4. **UX**: Adicione loading states e feedback visual
5. **Mobile**: Considere responsividade desde o início

---

## 📚 Recursos Úteis

- [Documentação Inertia.js](https://inertiajs.com/)
- [Documentação Laravel](https://laravel.com/docs)
- [Documentação React](https://react.dev/)
- [shadcn/ui Components](https://ui.shadcn.com/)

---

**Boa sorte com a implementação! 🚀**

