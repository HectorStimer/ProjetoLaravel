import { Head, Link, router } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { dashboard } from '@/routes';
import { type BreadcrumbItem, type Triage } from '@/types';
import { Plus, Trash2, FileText } from 'lucide-react';

interface Props {
    triages: Triage[];
    patients: Array<{ id: number; name: string }>;
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: dashboard().url,
    },
    {
        title: 'Triagens',
        href: '/triage',
    },
];

export default function TriageIndex({ triages, patients }: Props) {
    function handleDelete(id: number) {
        if (confirm('Tem certeza que deseja deletar esta triagem?')) {
            router.delete(`/triage/${id}`);
        }
    }

    function getScoreBadge(score: number) {
        const configs: Record<number, { variant: 'default' | 'secondary' | 'destructive' | 'outline', label: string, color: string }> = {
            1: { variant: 'destructive', label: 'Emergência', color: 'bg-red-500' },
            2: { variant: 'destructive', label: 'Urgente', color: 'bg-orange-500' },
            3: { variant: 'default', label: 'Alta', color: 'bg-yellow-500' },
            4: { variant: 'secondary', label: 'Média', color: 'bg-blue-500' },
            5: { variant: 'outline', label: 'Baixa', color: 'bg-gray-500' },
        };

        const config = configs[score] || configs[5];
        return (
            <Badge variant={config.variant} className={config.color}>
                {config.label} (Score: {score})
            </Badge>
        );
    }

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Triagens" />
            
            <div className="container mx-auto p-6">
                {/* Cabeçalho */}
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-3xl font-bold">Triagens</h1>
                    <Link href="/triage/create">
                        <Button>
                            <Plus className="mr-2 h-4 w-4" />
                            Nova Triagem
                        </Button>
                    </Link>
                </div>

                {/* Lista de Triagens */}
                {triages.length === 0 ? (
                    <Card>
                        <CardContent className="p-6 text-center text-gray-500">
                            Nenhuma triagem cadastrada ainda.
                        </CardContent>
                    </Card>
                ) : (
                    <div className="grid gap-4">
                        {triages.map((triage) => (
                            <Card key={triage.id}>
                                <CardHeader>
                                    <div className="flex justify-between items-start">
                                        <div className="flex-1">
                                            <div className="flex items-center gap-3 mb-2">
                                                <FileText className="h-5 w-5 text-gray-500" />
                                                <div>
                                                    <CardTitle>
                                                        {triage.patient?.name || 'Paciente não encontrado'}
                                                    </CardTitle>
                                                    <p className="text-sm text-gray-500 mt-1">
                                                        Triagista: {triage.trigist?.name || 'Não informado'}
                                                    </p>
                                                    <p className="text-sm text-gray-500">
                                                        Data: {new Date(triage.created_at).toLocaleString('pt-BR')}
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="flex gap-2 items-center mt-3">
                                                {getScoreBadge(triage.score)}
                                            </div>
                                            {triage.notes && (
                                                <div className="mt-3 p-3 bg-gray-50 dark:bg-gray-800 rounded">
                                                    <p className="text-sm text-gray-700 dark:text-gray-300">
                                                        <strong>Notas:</strong> {triage.notes}
                                                    </p>
                                                </div>
                                            )}
                                        </div>
                                        <div className="flex gap-2">
                                            <Button 
                                                variant="destructive" 
                                                size="sm"
                                                onClick={() => handleDelete(triage.id)}
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

