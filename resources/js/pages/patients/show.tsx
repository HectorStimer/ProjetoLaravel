import { Head, Link } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { dashboard } from '@/routes';
import { type BreadcrumbItem, type Patient } from '@/types';
import { ArrowLeft, Edit3 } from 'lucide-react';

interface Props {
    patient: Patient;
}

const breadcrumbs = (patient: Patient): BreadcrumbItem[] => [
    {
        title: 'Dashboard',
        href: dashboard().url,
    },
    {
        title: 'Pacientes',
        href: '/patients',
    },
    {
        title: patient.name,
        href: `/patients/${patient.id}`,
    },
];

export default function PatientShow({ patient }: Props) {
    return (
        <AppLayout breadcrumbs={breadcrumbs(patient)}>
            <Head title={`Paciente • ${patient.name}`} />

            <div className="container mx-auto max-w-3xl p-6 space-y-4">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold">{patient.name}</h1>
                        <p className="text-sm text-muted-foreground">
                            Detalhes do cadastro do paciente
                        </p>
                    </div>
                    <div className="flex gap-2">
                        <Link href="/patients">
                            <Button variant="outline">
                                <ArrowLeft className="mr-2 h-4 w-4" />
                                Voltar
                            </Button>
                        </Link>
                        <Link href={`/patients/${patient.id}/edit`}>
                            <Button>
                                <Edit3 className="mr-2 h-4 w-4" />
                                Editar
                            </Button>
                        </Link>
                    </div>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>Informações Básicas</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3 text-sm">
                        <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
                            <InfoRow label="Nome" value={patient.name} />
                            <InfoRow
                                label="CPF"
                                value={patient.document || 'Não informado'}
                            />
                            <InfoRow
                                label="Data de nascimento"
                                value={new Date(patient.birth_date).toLocaleDateString('pt-BR')}
                            />
                            <InfoRow
                                label="Telefone"
                                value={patient.phone || 'Não informado'}
                            />
                        </div>
                        <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
                            <InfoRow
                                label="Criado em"
                                value={new Date(patient.created_at).toLocaleString('pt-BR')}
                            />
                            <InfoRow
                                label="Atualizado em"
                                value={new Date(patient.updated_at).toLocaleString('pt-BR')}
                            />
                        </div>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}

function InfoRow({ label, value }: { label: string; value: string }) {
    return (
        <div>
            <p className="text-xs uppercase tracking-wide text-muted-foreground">{label}</p>
            <p className="font-medium text-foreground">{value}</p>
        </div>
    );
}

