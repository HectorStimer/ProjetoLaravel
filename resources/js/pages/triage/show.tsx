import { Head, Link } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { dashboard } from '@/routes';
import { type BreadcrumbItem, type Triage } from '@/types';
import { ArrowLeft, FileText } from 'lucide-react';

interface Props {
    triage: Triage;
}

const breadcrumbs = (triage: Triage): BreadcrumbItem[] => [
    {
        title: 'Dashboard',
        href: dashboard().url,
    },
    {
        title: 'Triagens',
        href: '/triage',
    },
    {
        title: `Triagem #${triage.id}`,
        href: `/triage/${triage.id}`,
    },
];

export default function TriageShow({ triage }: Props) {
    return (
        <AppLayout breadcrumbs={breadcrumbs(triage)}>
            <Head title={`Triagem • ${triage.patient?.name ?? triage.id}`} />

            <div className="container mx-auto max-w-3xl space-y-4 p-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold flex items-center gap-2">
                            <FileText className="h-6 w-6" />
                            Triagem #{triage.id}
                        </h1>
                        <p className="text-sm text-muted-foreground">
                            Registro criado em {new Date(triage.created_at).toLocaleString('pt-BR')}
                        </p>
                    </div>
                    <Link href="/triage">
                        <Button variant="outline">
                            <ArrowLeft className="mr-2 h-4 w-4" />
                            Voltar
                        </Button>
                    </Link>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>Informações da Triagem</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                            <InfoRow
                                label="Paciente"
                                value={triage.patient?.name ?? 'Paciente não informado'}
                            />
                            <InfoRow
                                label="Triagista"
                                value={triage.triagist?.name ?? 'Não informado'}
                            />
                        </div>
                        <div className="flex flex-wrap items-center gap-2">
                            <Badge variant="outline" className="text-base">
                                Score: {triage.score}
                            </Badge>
                        </div>
                        {triage.notes && (
                            <div>
                                <p className="text-xs uppercase tracking-wide text-muted-foreground">
                                    Observações
                                </p>
                                <p className="mt-1 whitespace-pre-line text-sm text-foreground">
                                    {triage.notes}
                                </p>
                            </div>
                        )}
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

