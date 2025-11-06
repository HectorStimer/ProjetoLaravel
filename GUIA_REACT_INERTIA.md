# 📚 Guia Completo: React + Inertia.js para Iniciantes

## 🎯 O que você precisa saber

Este projeto usa **Inertia.js**, que é uma forma especial de usar React com Laravel. É mais simples que React puro!

---

## 🔑 Conceitos Básicos do React

### 1. **Componentes**
Um componente é como uma função que retorna HTML (chamado de JSX).

```tsx
// Exemplo simples
function MeuComponente() {
  return <div>Olá Mundo!</div>;
}
```

### 2. **Props (Propriedades)**
São dados que você passa para um componente, como parâmetros de função.

```tsx
// Componente que recebe dados
function Saudacao({ nome }) {
  return <h1>Olá, {nome}!</h1>;
}

// Como usar
<Saudacao nome="João" />
```

### 3. **Estado (State)**
É como uma variável que, quando muda, atualiza a tela automaticamente.

```tsx
import { useState } from 'react';

function Contador() {
  const [numero, setNumero] = useState(0);
  
  return (
    <div>
      <p>Número: {numero}</p>
      <button onClick={() => setNumero(numero + 1)}>
        Aumentar
      </button>
    </div>
  );
}
```

### 4. **useEffect**
Executa código quando algo acontece (ex: quando a página carrega).

```tsx
import { useEffect } from 'react';

function MinhaPagina() {
  useEffect(() => {
    // Este código roda quando a página carrega
    console.log('Página carregou!');
  }, []); // [] significa "só uma vez"
  
  return <div>Minha página</div>;
}
```

---

## 🚀 Como Funciona o Inertia.js

### Diferença do React Normal

**React Normal:**
- Você faz chamadas API (axios, fetch)
- Você gerencia o estado manualmente
- Você atualiza a página manualmente

**Inertia.js:**
- O Laravel envia dados diretamente para o React
- Você usa componentes especiais do Inertia
- Tudo funciona como um site tradicional, mas com React!

### Como Funciona

1. **Laravel Controller** → Envia dados para a página
2. **Página React** → Recebe os dados como props
3. **Formulários** → Usam componente `Form` do Inertia
4. **Navegação** → Usa `Link` ou `router.visit()` do Inertia

---

## 📝 Estrutura de uma Página Inertia

### Exemplo Básico

```tsx
// resources/js/pages/patients/index.tsx
import { Head } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';

// Os dados vêm do Laravel Controller
interface Props {
  patients: Array<{
    id: number;
    name: string;
    document: string;
  }>;
}

export default function PatientsIndex({ patients }: Props) {
  return (
    <AppLayout>
      <Head title="Pacientes" />
      
      <div>
        <h1>Lista de Pacientes</h1>
        {patients.map(patient => (
          <div key={patient.id}>
            <p>{patient.name}</p>
          </div>
        ))}
      </div>
    </AppLayout>
  );
}
```

### No Laravel Controller

```php
// app/Http/Controllers/PatientController.php
public function index() {
    $patients = Patient::all();
    
    return Inertia::render('patients/index', [
        'patients' => $patients
    ]);
}
```

---

## 🎨 Componentes Mais Usados

### 1. **Form (Formulário)**

```tsx
import { Form } from '@inertiajs/react';

function CriarPaciente() {
  return (
    <Form
      method="post"
      action="/patients"
      className="space-y-4"
    >
      <input 
        type="text" 
        name="name" 
        placeholder="Nome"
      />
      <button type="submit">Salvar</button>
    </Form>
  );
}
```

### 2. **Link (Navegação)**

```tsx
import { Link } from '@inertiajs/react';

<Link href="/patients">Ver Pacientes</Link>
```

### 3. **router (Navegação Programática)**

```tsx
import { router } from '@inertiajs/react';

// Navegar para outra página
router.visit('/patients');

// Fazer uma requisição POST
router.post('/patients', {
  name: 'João',
  document: '123456'
});
```

---

## 🛠️ Componentes UI Disponíveis

O projeto já tem componentes prontos! Use eles:

### Button
```tsx
import { Button } from '@/components/ui/button';

<Button>Clique aqui</Button>
<Button variant="destructive">Deletar</Button>
<Button variant="outline">Cancelar</Button>
```

### Card
```tsx
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

<Card>
  <CardHeader>
    <CardTitle>Título</CardTitle>
  </CardHeader>
  <CardContent>
    Conteúdo aqui
  </CardContent>
</Card>
```

### Input
```tsx
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

<div>
  <Label htmlFor="nome">Nome</Label>
  <Input id="nome" type="text" name="name" />
</div>
```

---

## 📋 Passo a Passo: Criar uma Página

### Passo 1: Criar a Página React

```tsx
// resources/js/pages/patients/index.tsx
import { Head } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';

interface Props {
  patients: Patient[];
}

export default function PatientsIndex({ patients }: Props) {
  return (
    <AppLayout>
      <Head title="Pacientes" />
      <h1>Pacientes</h1>
      {/* Seu código aqui */}
    </AppLayout>
  );
}
```

### Passo 2: Criar o Controller Laravel

```php
// app/Http/Controllers/PatientController.php
use Inertia\Inertia;

public function index() {
    $patients = Patient::all();
    
    return Inertia::render('patients/index', [
        'patients' => $patients
    ]);
}
```

### Passo 3: Adicionar Rota

```php
// routes/web.php
Route::get('/patients', [PatientController::class, 'index'])
    ->middleware(['auth', 'verified']);
```

---

## 🎯 Padrões Comuns

### Listagem com Tabela

```tsx
<table>
  <thead>
    <tr>
      <th>Nome</th>
      <th>Documento</th>
    </tr>
  </thead>
  <tbody>
    {patients.map(patient => (
      <tr key={patient.id}>
        <td>{patient.name}</td>
        <td>{patient.document}</td>
      </tr>
    ))}
  </tbody>
</table>
```

### Formulário com Validação

```tsx
import { Form } from '@inertiajs/react';
import InputError from '@/components/input-error';

<Form method="post" action="/patients">
  {({ processing, errors }) => (
    <>
      <input name="name" />
      <InputError message={errors.name} />
      
      <button disabled={processing}>
        {processing ? 'Salvando...' : 'Salvar'}
      </button>
    </>
  )}
</Form>
```

### Botões de Ação

```tsx
import { router } from '@inertiajs/react';

<button onClick={() => router.delete(`/patients/${patient.id}`)}>
  Deletar
</button>

<Link href={`/patients/${patient.id}/edit`}>
  Editar
</Link>
```

---

## 🔄 Estados e Loading

### Estado de Loading

```tsx
import { router } from '@inertiajs/react';
import { useState } from 'react';

function MinhaPagina() {
  const [loading, setLoading] = useState(false);
  
  function deletar(id) {
    setLoading(true);
    router.delete(`/patients/${id}`, {
      onFinish: () => setLoading(false)
    });
  }
  
  return (
    <button disabled={loading} onClick={() => deletar(1)}>
      {loading ? 'Deletando...' : 'Deletar'}
    </button>
  );
}
```

### Estado Local

```tsx
import { useState } from 'react';

function BuscarPaciente() {
  const [busca, setBusca] = useState('');
  
  return (
    <input 
      value={busca}
      onChange={(e) => setBusca(e.target.value)}
      placeholder="Buscar..."
    />
  );
}
```

---

## 🎨 Estilização com Tailwind

O projeto usa Tailwind CSS. É muito simples:

```tsx
// Classes do Tailwind
<div className="p-4 bg-blue-500 text-white rounded">
  Conteúdo
</div>

// Explicação:
// p-4 = padding de 4
// bg-blue-500 = fundo azul
// text-white = texto branco
// rounded = bordas arredondadas
```

### Classes Mais Usadas

- `p-4` = padding
- `m-4` = margin
- `bg-white` = fundo branco
- `text-black` = texto preto
- `rounded` = bordas arredondadas
- `shadow` = sombra
- `flex` = display flex
- `grid` = display grid
- `gap-4` = espaço entre elementos
- `space-y-4` = espaço vertical

---

## 🚨 Erros Comuns

### 1. Esquecer de importar
```tsx
// ❌ Errado
export default function MinhaPagina() {
  return <Button>Clique</Button>; // Button não importado
}

// ✅ Correto
import { Button } from '@/components/ui/button';
export default function MinhaPagina() {
  return <Button>Clique</Button>;
}
```

### 2. Esquecer a key no map
```tsx
// ❌ Errado
{items.map(item => <div>{item.name}</div>)}

// ✅ Correto
{items.map(item => <div key={item.id}>{item.name}</div>)}
```

### 3. Não usar o Layout
```tsx
// ❌ Errado
export default function MinhaPagina() {
  return <div>Conteúdo</div>;
}

// ✅ Correto
import AppLayout from '@/layouts/app-layout';
export default function MinhaPagina() {
  return (
    <AppLayout>
      <div>Conteúdo</div>
    </AppLayout>
  );
}
```

---

## 📚 Recursos para Aprender Mais

1. **React Oficial**: https://react.dev/learn
2. **Inertia.js**: https://inertiajs.com/
3. **Tailwind CSS**: https://tailwindcss.com/docs
4. **shadcn/ui**: https://ui.shadcn.com/

---

## 🎯 Próximos Passos

Agora que você entende o básico, vamos criar a primeira página funcional!

Veja o arquivo `EXEMPLO_PAGINA_PACIENTES.md` para um exemplo completo passo a passo.

