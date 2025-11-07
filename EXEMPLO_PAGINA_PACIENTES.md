# 📝 Exemplo Prático: Página de Listagem de Pacientes

Este guia mostra passo a passo como criar uma página funcional de listagem de pacientes.

---

## 🎯 O que vamos criar

Uma página que:
- Lista todos os pacientes
- Mostra nome, documento e data de nascimento
- Tem um botão para adicionar novo paciente
- Tem botões para editar e deletar

---

## 📋 Passo 1: Criar Controller Inertia

Primeiro, vamos criar um controller que usa Inertia (não API).

**Arquivo:** `app/Http/Controllers/PatientController.php`

```php
<?php

namespace App\Http\Controllers;

use App\Models\Patient;
use Inertia\Inertia;
use Inertia\Response;

class PatientController extends Controller
{
    /**
     * Listar todos os pacientes
     */
    public function index(): Response
    {
        $patients = Patient::orderBy('created_at', 'desc')->get();
        
        return Inertia::render('patients/index', [
            'patients' => $patients
        ]);
    }
    
    /**
     * Mostrar formulário de criação
     */
    public function create(): Response
    {
        return Inertia::render('patients/create');
    }
    
    /**
     * Salvar novo paciente
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'document' => 'nullable|string|max:20|unique:patients,document',
            'birth_date' => 'required|date',
            'phone' => 'nullable|string|max:15',
        ]);
        
        $validated['created_by'] = auth()->id();
        
        Patient::create($validated);
        
        return redirect()->route('patients.index')
            ->with('success', 'Paciente criado com sucesso!');
    }
    
    /**
     * Mostrar paciente específico
     */
    public function show(Patient $patient): Response
    {
        return Inertia::render('patients/show', [
            'patient' => $patient
        ]);
    }
    
    /**
     * Mostrar formulário de edição
     */
    public function edit(Patient $patient): Response
    {
        return Inertia::render('patients/edit', [
            'patient' => $patient
        ]);
    }
    
    /**
     * Atualizar paciente
     */
    public function update(Request $request, Patient $patient)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'document' => 'nullable|string|max:20|unique:patients,document,' . $patient->id,
            'birth_date' => 'required|date',
            'phone' => 'nullable|string|max:15',
        ]);
        
        $patient->update($validated);
        
        return redirect()->route('patients.index')
            ->with('success', 'Paciente atualizado com sucesso!');
    }
    
    /**
     * Deletar paciente
     */
    public function destroy(Patient $patient)
    {
        $patient->delete();
        
        return redirect()->route('patients.index')
            ->with('success', 'Paciente deletado com sucesso!');
    }
}
```

**Importante:** Adicione `use Illuminate\Http\Request;` no topo do arquivo.

---

## 📋 Passo 2: Adicionar Rotas

**Arquivo:** `routes/web.php`

Adicione estas rotas dentro do grupo `middleware(['auth', 'verified'])`:

```php
use App\Http\Controllers\PatientController;

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', function () {
        return Inertia::render('dashboard');
    })->name('dashboard');
    
    // Rotas de Pacientes
    Route::resource('patients', PatientController::class);
});
```

A linha `Route::resource` cria automaticamente todas as rotas:
- GET `/patients` → index
- GET `/patients/create` → create
- POST `/patients` → store
- GET `/patients/{id}` → show
- GET `/patients/{id}/edit` → edit
- PUT `/patients/{id}` → update
- DELETE `/patients/{id}` → destroy

---

## 📋 Passo 3: Criar Tipos TypeScript

**Arquivo:** `resources/js/types/index.d.ts`

Adicione o tipo Patient:

```typescript
export interface Patient {
    id: number;
    name: string;
    document: string | null;
    birth_date: string;
    phone: string | null;
    created_by: number | null;
    created_at: string;
    updated_at: string;
}
```

---

## 📋 Passo 4: Criar a Página de Listagem

**Arquivo:** `resources/js/pages/patients/index.tsx`

```tsx
import { Head, Link, router } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { type Patient } from '@/types';
import { Plus, Edit, Trash2 } from 'lucide-react';

interface Props {
    patients: Patient[];
}

export default function PatientsIndex({ patients }: Props) {
    function handleDelete(id: number) {
        if (confirm('Tem certeza que deseja deletar este paciente?')) {
            router.delete(`/patients/${id}`);
        }
    }

    return (
        <AppLayout>
            <Head title="Pacientes" />
            
            <div className="container mx-auto p-6">
                {/* Cabeçalho */}
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-3xl font-bold">Pacientes</h1>
                    <Link href="/patients/create">
                        <Button>
                            <Plus className="mr-2 h-4 w-4" />
                            Novo Paciente
                        </Button>
                    </Link>
                </div>

                {/* Lista de Pacientes */}
                {patients.length === 0 ? (
                    <Card>
                        <CardContent className="p-6 text-center text-gray-500">
                            Nenhum paciente cadastrado ainda.
                        </CardContent>
                    </Card>
                ) : (
                    <div className="grid gap-4">
                        {patients.map((patient) => (
                            <Card key={patient.id}>
                                <CardHeader>
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <CardTitle>{patient.name}</CardTitle>
                                            <p className="text-sm text-gray-500 mt-1">
                                                {patient.document && `CPF: ${patient.document}`}
                                            </p>
                                            <p className="text-sm text-gray-500">
                                                Nascimento: {new Date(patient.birth_date).toLocaleDateString('pt-BR')}
                                            </p>
                                            {patient.phone && (
                                                <p className="text-sm text-gray-500">
                                                    Telefone: {patient.phone}
                                                </p>
                                            )}
                                        </div>
                                        <div className="flex gap-2">
                                            <Link href={`/patients/${patient.id}/edit`}>
                                                <Button variant="outline" size="sm">
                                                    <Edit className="h-4 w-4" />
                                                </Button>
                                            </Link>
                                            <Button 
                                                variant="destructive" 
                                                size="sm"
                                                onClick={() => handleDelete(patient.id)}
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    </div>
                                </CardHeader>
                            </Card>
                        ))}
                    </div>
                )}
            </div>
        </AppLayout>
    );
}
```

---

## 📋 Passo 5: Criar Página de Criação

**Arquivo:** `resources/js/pages/patients/create.tsx`

```tsx
import { Head, Link, useForm } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import InputError from '@/components/input-error';

export default function PatientsCreate() {
    const { data, setData, post, processing, errors } = useForm({
        name: '',
        document: '',
        birth_date: '',
        phone: '',
    });

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        post('/patients');
    }

    return (
        <AppLayout>
            <Head title="Novo Paciente" />
            
            <div className="container mx-auto p-6 max-w-2xl">
                <Card>
                    <CardHeader>
                        <CardTitle>Novo Paciente</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <Label htmlFor="name">Nome *</Label>
                                <Input
                                    id="name"
                                    value={data.name}
                                    onChange={(e) => setData('name', e.target.value)}
                                    required
                                />
                                <InputError message={errors.name} />
                            </div>

                            <div>
                                <Label htmlFor="document">CPF</Label>
                                <Input
                                    id="document"
                                    value={data.document}
                                    onChange={(e) => setData('document', e.target.value)}
                                />
                                <InputError message={errors.document} />
                            </div>

                            <div>
                                <Label htmlFor="birth_date">Data de Nascimento *</Label>
                                <Input
                                    id="birth_date"
                                    type="date"
                                    value={data.birth_date}
                                    onChange={(e) => setData('birth_date', e.target.value)}
                                    required
                                />
                                <InputError message={errors.birth_date} />
                            </div>

                            <div>
                                <Label htmlFor="phone">Telefone</Label>
                                <Input
                                    id="phone"
                                    value={data.phone}
                                    onChange={(e) => setData('phone', e.target.value)}
                                />
                                <InputError message={errors.phone} />
                            </div>

                            <div className="flex gap-2 justify-end">
                                <Link href="/patients">
                                    <Button type="button" variant="outline">
                                        Cancelar
                                    </Button>
                                </Link>
                                <Button type="submit" disabled={processing}>
                                    {processing ? 'Salvando...' : 'Salvar'}
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
```

---

## 📋 Passo 6: Criar Página de Edição

**Arquivo:** `resources/js/pages/patients/edit.tsx`

```tsx
import { Head, Link, useForm } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import InputError from '@/components/input-error';
import { type Patient } from '@/types';

interface Props {
    patient: Patient;
}

export default function PatientsEdit({ patient }: Props) {
    const { data, setData, put, processing, errors } = useForm({
        name: patient.name,
        document: patient.document || '',
        birth_date: patient.birth_date,
        phone: patient.phone || '',
    });

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        put(`/patients/${patient.id}`);
    }

    return (
        <AppLayout>
            <Head title="Editar Paciente" />
            
            <div className="container mx-auto p-6 max-w-2xl">
                <Card>
                    <CardHeader>
                        <CardTitle>Editar Paciente</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <Label htmlFor="name">Nome *</Label>
                                <Input
                                    id="name"
                                    value={data.name}
                                    onChange={(e) => setData('name', e.target.value)}
                                    required
                                />
                                <InputError message={errors.name} />
                            </div>

                            <div>
                                <Label htmlFor="document">CPF</Label>
                                <Input
                                    id="document"
                                    value={data.document}
                                    onChange={(e) => setData('document', e.target.value)}
                                />
                                <InputError message={errors.document} />
                            </div>

                            <div>
                                <Label htmlFor="birth_date">Data de Nascimento *</Label>
                                <Input
                                    id="birth_date"
                                    type="date"
                                    value={data.birth_date}
                                    onChange={(e) => setData('birth_date', e.target.value)}
                                    required
                                />
                                <InputError message={errors.birth_date} />
                            </div>

                            <div>
                                <Label htmlFor="phone">Telefone</Label>
                                <Input
                                    id="phone"
                                    value={data.phone}
                                    onChange={(e) => setData('phone', e.target.value)}
                                />
                                <InputError message={errors.phone} />
                            </div>

                            <div className="flex gap-2 justify-end">
                                <Link href="/patients">
                                    <Button type="button" variant="outline">
                                        Cancelar
                                    </Button>
                                </Link>
                                <Button type="submit" disabled={processing}>
                                    {processing ? 'Salvando...' : 'Salvar'}
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
```

---

## 🎯 Explicação dos Conceitos

### 1. **useForm do Inertia**
```tsx
const { data, setData, post, processing, errors } = useForm({
    name: '',
    document: '',
});
```

- `data`: Objeto com os dados do formulário
- `setData`: Função para atualizar um campo
- `post`: Função para enviar formulário (POST)
- `put`: Função para atualizar (PUT)
- `processing`: Boolean que indica se está processando
- `errors`: Objeto com erros de validação

### 2. **Navegação**
```tsx
// Link para outra página
<Link href="/patients">Ver Pacientes</Link>

// Navegação programática
router.delete(`/patients/${id}`);
```

### 3. **Props da Página**
Os dados vêm do Laravel Controller:
```php
return Inertia::render('patients/index', [
    'patients' => $patients  // ← Isso vira props no React
]);
```

No React:
```tsx
interface Props {
    patients: Patient[];  // ← Recebe os dados aqui
}

export default function PatientsIndex({ patients }: Props) {
    // Usa os dados
}
```

---

## ✅ Testando

1. Acesse `/patients` no navegador
2. Você deve ver a lista de pacientes
3. Clique em "Novo Paciente" para criar
4. Clique em "Editar" para editar
5. Clique em "Deletar" para deletar

---

## 🎨 Melhorias Opcionais

### Adicionar Busca
```tsx
const [search, setSearch] = useState('');

const filteredPatients = patients.filter(patient =>
    patient.name.toLowerCase().includes(search.toLowerCase())
);
```

### Adicionar Paginação
No Controller:
```php
$patients = Patient::paginate(10);
```

Na página:
```tsx
interface Props {
    patients: {
        data: Patient[];
        links: any;
    };
}
```

---

## 🚀 Próximos Passos

Agora que você tem a página de pacientes funcionando, você pode:

1. Criar páginas de Fila (similar)
2. Criar páginas de Triagem (similar)
3. Criar Dashboards (usando os mesmos conceitos)

Todas seguem o mesmo padrão:
1. Controller Inertia
2. Rota
3. Página React
4. Tipos TypeScript

Boa sorte! 🎉


