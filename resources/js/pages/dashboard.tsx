import { Head, Link, router } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { dashboard } from '@/routes';
import { type BreadcrumbItem, type QueueEntry, type Patient, type Triage } from '@/types';
import { 
    Users, 
    Clock, 
    CheckCircle, 
    Activity, 
    Stethoscope,
    Phone,
    Play,
    Plus
} from 'lucide-react';

interface AdminDashboardProps {
    type: 'admin';
    summary: {
        total_patients: number;
        active_queue: number;
        patients_served_today: number;
        average_wait_time: number;
        average_service_time: number;
    };
    queueStatus: {
        waiting: number;
        called: number;
        in_service: number;
        finished: number;
        canceled: number;
    };
    recentPatients: Patient[];
    serviceStats: Array<{
        service: { id: number; name: string };
        total_entries: number;
        active_entries: number;
    }>;
}

interface TriagistDashboardProps {
    type: 'triagist';
    queueForScreening: QueueEntry[];
    recentTriages: Triage[];
    triageStatistics: {
        total_triages: number;
        triages_today: number;
        average_score: number;
    };
}

interface DoctorDashboardProps {
    type: 'doctor';
    currentQueue: QueueEntry[];
    recentPatients: Patient[];
    summary: {
        waiting: number;
        called: number;
        in_service: number;
    };
}

type DashboardProps = AdminDashboardProps | TriagistDashboardProps | DoctorDashboardProps;

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: dashboard().url,
    },
];

export default function Dashboard(props: DashboardProps) {
    if (props.type === 'admin') {
        return <AdminDashboard {...props} />;
    } else if (props.type === 'triagist') {
        return <TriagistDashboard {...props} />;
    } else {
        return <DoctorDashboard {...props} />;
    }
}

function AdminDashboard({ summary, queueStatus, recentPatients, serviceStats }: AdminDashboardProps) {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard - Administrador" />
            
            <div className="container mx-auto p-6">
                <h1 className="text-3xl font-bold mb-6">Dashboard Administrador</h1>

                {/* Cards de Resumo */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
                    <Card>
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-medium">Total de Pacientes</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{summary.total_patients}</div>
                            <Users className="h-4 w-4 text-gray-500 mt-2" />
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-medium">Fila Ativa</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{summary.active_queue}</div>
                            <Activity className="h-4 w-4 text-gray-500 mt-2" />
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-medium">Atendidos Hoje</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{summary.patients_served_today}</div>
                            <CheckCircle className="h-4 w-4 text-gray-500 mt-2" />
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-medium">Tempo Médio de Espera</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{Math.round(summary.average_wait_time)} min</div>
                            <Clock className="h-4 w-4 text-gray-500 mt-2" />
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-medium">Tempo Médio de Atendimento</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{Math.round(summary.average_service_time)} min</div>
                            <Stethoscope className="h-4 w-4 text-gray-500 mt-2" />
                        </CardContent>
                    </Card>
                </div>

                {/* Status da Fila */}
                <Card className="mb-6">
                    <CardHeader>
                        <CardTitle>Status da Fila</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-5 gap-4">
                            <div>
                                <div className="text-sm text-gray-500">Aguardando</div>
                                <div className="text-2xl font-bold">{queueStatus.waiting}</div>
                            </div>
                            <div>
                                <div className="text-sm text-gray-500">Chamados</div>
                                <div className="text-2xl font-bold">{queueStatus.called}</div>
                            </div>
                            <div>
                                <div className="text-sm text-gray-500">Em Atendimento</div>
                                <div className="text-2xl font-bold">{queueStatus.in_service}</div>
                            </div>
                            <div>
                                <div className="text-sm text-gray-500">Finalizados</div>
                                <div className="text-2xl font-bold">{queueStatus.finished}</div>
                            </div>
                            <div>
                                <div className="text-sm text-gray-500">Cancelados</div>
                                <div className="text-2xl font-bold">{queueStatus.canceled}</div>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Pacientes Recentes */}
                    <Card>
                        <CardHeader>
                            <div className="flex justify-between items-center">
                                <CardTitle>Pacientes Recentes</CardTitle>
                                <Link href="/patients">
                                    <Button variant="outline" size="sm">Ver Todos</Button>
                                </Link>
                            </div>
                        </CardHeader>
                        <CardContent>
                            {recentPatients.length === 0 ? (
                                <p className="text-gray-500 text-center py-4">Nenhum paciente cadastrado</p>
                            ) : (
                                <div className="space-y-2">
                                    {recentPatients.map((patient) => (
                                        <div key={patient.id} className="flex justify-between items-center p-2 border-b">
                                            <div>
                                                <div className="font-medium">{patient.name}</div>
                                                <div className="text-sm text-gray-500">
                                                    {new Date(patient.created_at).toLocaleDateString('pt-BR')}
                                                </div>
                                            </div>
                                            <Link href={`/patients/${patient.id}`}>
                                                <Button variant="ghost" size="sm">Ver</Button>
                                            </Link>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {/* Estatísticas por Serviço */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Estatísticas por Serviço</CardTitle>
                        </CardHeader>
                        <CardContent>
                            {serviceStats.length === 0 ? (
                                <p className="text-gray-500 text-center py-4">Nenhum serviço cadastrado</p>
                            ) : (
                                <div className="space-y-3">
                                    {serviceStats.map((stat) => (
                                        <div key={stat.service.id} className="p-3 border rounded">
                                            <div className="font-medium">{stat.service.name}</div>
                                            <div className="flex gap-4 mt-2 text-sm">
                                                <span className="text-gray-500">
                                                    Total: <strong>{stat.total_entries}</strong>
                                                </span>
                                                <span className="text-gray-500">
                                                    Ativos: <strong>{stat.active_entries}</strong>
                                                </span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AppLayout>
    );
}

function TriagistDashboard({ queueForScreening, recentTriages, triageStatistics }: TriagistDashboardProps) {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard - Triagista" />
            
            <div className="container mx-auto p-6">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-3xl font-bold">Dashboard Triagista</h1>
                    <Link href="/triage/create">
                        <Button>
                            <Plus className="mr-2 h-4 w-4" />
                            Nova Triagem
                        </Button>
                    </Link>
                </div>

                {/* Estatísticas */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                    <Card>
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-medium">Total de Triagens</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{triageStatistics.total_triages}</div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-medium">Triagens Hoje</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{triageStatistics.triages_today}</div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-medium">Score Médio</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{triageStatistics.average_score.toFixed(1)}</div>
                        </CardContent>
                    </Card>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Fila para Triagem */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Fila para Triagem</CardTitle>
                        </CardHeader>
                        <CardContent>
                            {queueForScreening.length === 0 ? (
                                <p className="text-gray-500 text-center py-4">Nenhum paciente aguardando triagem</p>
                            ) : (
                                <div className="space-y-2">
                                    {queueForScreening.slice(0, 10).map((entry) => (
                                        <div key={entry.id} className="p-3 border rounded">
                                            <div className="font-medium">{entry.patient?.name || 'Paciente não encontrado'}</div>
                                            <div className="text-sm text-gray-500">
                                                {entry.service?.name || 'Serviço não encontrado'}
                                            </div>
                                            <Badge variant="outline" className="mt-2">
                                                Prioridade: {entry.priority}
                                            </Badge>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {/* Triagens Recentes */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Triagens Recentes</CardTitle>
                        </CardHeader>
                        <CardContent>
                            {recentTriages.length === 0 ? (
                                <p className="text-gray-500 text-center py-4">Nenhuma triagem realizada</p>
                            ) : (
                                <div className="space-y-2">
                                    {recentTriages.map((triage) => (
                                        <div key={triage.id} className="p-3 border rounded">
                                            <div className="font-medium">{triage.patient?.name || 'Paciente não encontrado'}</div>
                                            <div className="flex items-center gap-2 mt-2">
                                                <Badge>Score: {triage.score}</Badge>
                                                <span className="text-sm text-gray-500">
                                                    {new Date(triage.created_at).toLocaleDateString('pt-BR')}
                                                </span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AppLayout>
    );
}

function DoctorDashboard({ currentQueue, recentPatients, summary }: DoctorDashboardProps) {
    function handleCallNext() {
        router.post('/queue/call-next');
    }

    function handleStart(id: number) {
        router.post(`/queue/${id}/start`);
    }

    function handleFinish(id: number) {
        router.post(`/queue/${id}/finish`);
    }

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard - Médico" />
            
            <div className="container mx-auto p-6">
                <h1 className="text-3xl font-bold mb-6">Dashboard Médico</h1>

                {/* Resumo */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                    <Card>
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-medium">Aguardando</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{summary.waiting}</div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-medium">Chamados</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{summary.called}</div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-medium">Em Atendimento</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{summary.in_service}</div>
                        </CardContent>
                    </Card>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Fila Atual */}
                    <Card>
                        <CardHeader>
                            <div className="flex justify-between items-center">
                                <CardTitle>Fila de Atendimento</CardTitle>
                                <Button onClick={handleCallNext} size="sm" variant="secondary">
                                    <Phone className="mr-2 h-4 w-4" />
                                    Chamar Próximo
                                </Button>
                            </div>
                        </CardHeader>
                        <CardContent>
                            {currentQueue.length === 0 ? (
                                <p className="text-gray-500 text-center py-4">Nenhum paciente na fila</p>
                            ) : (
                                <div className="space-y-2">
                                    {currentQueue.map((entry) => (
                                        <div key={entry.id} className="p-3 border rounded">
                                            <div className="font-medium">{entry.patient?.name || 'Paciente não encontrado'}</div>
                                            <div className="text-sm text-gray-500 mb-2">
                                                {entry.service?.name || 'Serviço não encontrado'}
                                            </div>
                                            <div className="flex gap-2 mt-2">
                                                {entry.status === 'called' && (
                                                    <Button size="sm" onClick={() => handleStart(entry.id)}>
                                                        <Play className="mr-1 h-3 w-3" />
                                                        Iniciar
                                                    </Button>
                                                )}
                                                {entry.status === 'in_service' && (
                                                    <Button size="sm" onClick={() => handleFinish(entry.id)}>
                                                        <CheckCircle className="mr-1 h-3 w-3" />
                                                        Finalizar
                                                    </Button>
                                                )}
                                                <Badge variant="outline">
                                                    {entry.status === 'called' ? 'Chamado' : 'Em Atendimento'}
                                                </Badge>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {/* Pacientes Recentes */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Pacientes Recentes</CardTitle>
                        </CardHeader>
                        <CardContent>
                            {recentPatients.length === 0 ? (
                                <p className="text-gray-500 text-center py-4">Nenhum paciente cadastrado</p>
                            ) : (
                                <div className="space-y-2">
                                    {recentPatients.map((patient) => (
                                        <div key={patient.id} className="flex justify-between items-center p-2 border-b">
                                            <div>
                                                <div className="font-medium">{patient.name}</div>
                                                <div className="text-sm text-gray-500">
                                                    {new Date(patient.created_at).toLocaleDateString('pt-BR')}
                                                </div>
                                            </div>
                                            <Link href={`/patients/${patient.id}`}>
                                                <Button variant="ghost" size="sm">Ver</Button>
                                            </Link>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AppLayout>
    );
}
