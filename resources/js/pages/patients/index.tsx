import { Head, Link, router } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { type Patient } from '@/types';
import { Plus, Edit, Trash2 } from 'lucide-react';
import { dashboard } from '@/routes';
import { type BreadcrumbItem } from '@/types';

interface Props {
    patients: Patient[];
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: dashboard().url,
    },
    {
        title: 'Pacientes',
        href: '/patients',
    },
];

export default function PatientsIndex({ patients }: Props) {
    function handleDelete(id: number) {
        if (confirm('Tem certeza que deseja deletar este paciente?')) {
            router.delete(`/patients/${id}`);
        }
    }

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
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


