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
    Plus,
    RefreshCw
} from 'lucide-react';
import { useEffect, useState } from 'react';
import api from '@/lib/api';

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
    // Debug: verificar o que está sendo recebido
    console.log('Dashboard props recebidas:', props);
    console.log('Tipo do dashboard:', props.type);
    
    if (props.type === 'admin') {
        return <AdminDashboard {...props} />;
    } else if (props.type === 'triagist') {
        return <TriagistDashboard {...props} />;
    } else if (props.type === 'doctor') {
        return <DoctorDashboard {...props} />;
    } else {
        // Fallback: se não tiver tipo definido, tenta detectar pelo conteúdo
        console.warn('Tipo de dashboard não reconhecido:', props);
        // Se tiver queueForScreening, é triagista
        if ('queueForScreening' in props) {
            return <TriagistDashboard {...(props as TriagistDashboardProps)} />;
        }
        // Se tiver currentQueue, é médico
        if ('currentQueue' in props) {
            return <DoctorDashboard {...(props as DoctorDashboardProps)} />;
        }
        // Default: admin
        return <AdminDashboard {...(props as AdminDashboardProps)} />;
    }
}

function AdminDashboard({ summary: initialSummary, queueStatus: initialQueueStatus, recentPatients: initialRecentPatients, serviceStats: initialServiceStats }: AdminDashboardProps) {
    const [summary, setSummary] = useState(initialSummary);
    const [queueStatus, setQueueStatus] = useState(initialQueueStatus);
    const [recentPatients, setRecentPatients] = useState(initialRecentPatients);
    const [serviceStats, setServiceStats] = useState(initialServiceStats);
    const [isRefreshing, setIsRefreshing] = useState(false);

    async function refreshData() {
        try {
            setIsRefreshing(true);
            const [summaryRes, queueStatusRes, serviceStatsRes] = await Promise.all([
                api.get('/dashboard/summary'),
                api.get('/dashboard/stats/status'),
                api.get('/dashboard/stats/services'),
            ]);
            
            setSummary(summaryRes.data);
            setQueueStatus(queueStatusRes.data);
            setServiceStats(serviceStatsRes.data);
            
            // Atualizar pacientes recentes
            const patientsRes = await api.get('/patients');
            setRecentPatients(patientsRes.data.slice(0, 10));
        } catch (error) {
            console.error('Erro ao atualizar dashboard:', error);
        } finally {
            setIsRefreshing(false);
        }
    }

    useEffect(() => {
        // Atualizar a cada 30 segundos
        const interval = setInterval(refreshData, 30000);
        return () => clearInterval(interval);
    }, []);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard - Administrador" />
            
            <div className="container mx-auto p-6 space-y-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                            Dashboard Administrador
                        </h1>
                        <p className="text-muted-foreground mt-2">Visão geral do sistema de atendimento</p>
                    </div>
                    <Button 
                        variant="outline" 
                        size="sm"
                        onClick={refreshData}
                        disabled={isRefreshing}
                        className="hover:bg-primary hover:text-primary-foreground transition-colors"
                    >
                        <RefreshCw className={`h-4 w-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
                        Atualizar
                    </Button>
                </div>

                {/* Cards de Resumo */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                    <Card className="relative overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950/20 dark:to-blue-900/10">
                        <div className="absolute top-0 right-0 w-20 h-20 bg-blue-500/10 rounded-full -mr-10 -mt-10"></div>
                        <CardHeader className="pb-2 relative z-10">
                            <CardTitle className="text-sm font-medium text-blue-700 dark:text-blue-300">Total de Pacientes</CardTitle>
                        </CardHeader>
                        <CardContent className="relative z-10">
                            <div className="text-3xl font-bold text-blue-900 dark:text-blue-100">{summary.total_patients}</div>
                            <div className="mt-3 flex items-center gap-2">
                                <Users className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                                <span className="text-xs text-blue-600 dark:text-blue-400">Cadastrados</span>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="relative overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 bg-gradient-to-br from-green-50 to-green-100 dark:from-green-950/20 dark:to-green-900/10">
                        <div className="absolute top-0 right-0 w-20 h-20 bg-green-500/10 rounded-full -mr-10 -mt-10"></div>
                        <CardHeader className="pb-2 relative z-10">
                            <CardTitle className="text-sm font-medium text-green-700 dark:text-green-300">Fila Ativa</CardTitle>
                        </CardHeader>
                        <CardContent className="relative z-10">
                            <div className="text-3xl font-bold text-green-900 dark:text-green-100">{summary.active_queue}</div>
                            <div className="mt-3 flex items-center gap-2">
                                <Activity className="h-5 w-5 text-green-600 dark:text-green-400" />
                                <span className="text-xs text-green-600 dark:text-green-400">Em espera</span>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="relative overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-950/20 dark:to-purple-900/10">
                        <div className="absolute top-0 right-0 w-20 h-20 bg-purple-500/10 rounded-full -mr-10 -mt-10"></div>
                        <CardHeader className="pb-2 relative z-10">
                            <CardTitle className="text-sm font-medium text-purple-700 dark:text-purple-300">Atendidos Hoje</CardTitle>
                        </CardHeader>
                        <CardContent className="relative z-10">
                            <div className="text-3xl font-bold text-purple-900 dark:text-purple-100">{summary.patients_served_today}</div>
                            <div className="mt-3 flex items-center gap-2">
                                <CheckCircle className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                                <span className="text-xs text-purple-600 dark:text-purple-400">Finalizados</span>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="relative overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-950/20 dark:to-orange-900/10">
                        <div className="absolute top-0 right-0 w-20 h-20 bg-orange-500/10 rounded-full -mr-10 -mt-10"></div>
                        <CardHeader className="pb-2 relative z-10">
                            <CardTitle className="text-sm font-medium text-orange-700 dark:text-orange-300">Tempo Médio de Espera</CardTitle>
                        </CardHeader>
                        <CardContent className="relative z-10">
                            <div className="text-3xl font-bold text-orange-900 dark:text-orange-100">{Math.round(summary.average_wait_time)} min</div>
                            <div className="mt-3 flex items-center gap-2">
                                <Clock className="h-5 w-5 text-orange-600 dark:text-orange-400" />
                                <span className="text-xs text-orange-600 dark:text-orange-400">Média</span>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="relative overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 bg-gradient-to-br from-red-50 to-red-100 dark:from-red-950/20 dark:to-red-900/10">
                        <div className="absolute top-0 right-0 w-20 h-20 bg-red-500/10 rounded-full -mr-10 -mt-10"></div>
                        <CardHeader className="pb-2 relative z-10">
                            <CardTitle className="text-sm font-medium text-red-700 dark:text-red-300">Tempo Médio de Atendimento</CardTitle>
                        </CardHeader>
                        <CardContent className="relative z-10">
                            <div className="text-3xl font-bold text-red-900 dark:text-red-100">{Math.round(summary.average_service_time)} min</div>
                            <div className="mt-3 flex items-center gap-2">
                                <Stethoscope className="h-5 w-5 text-red-600 dark:text-red-400" />
                                <span className="text-xs text-red-600 dark:text-red-400">Duração</span>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Status da Fila */}
                <Card className="border-0 shadow-lg">
                    <CardHeader>
                        <CardTitle className="text-xl">Status da Fila</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                            <div className="p-4 rounded-lg bg-gradient-to-br from-yellow-50 to-yellow-100 dark:from-yellow-950/20 dark:to-yellow-900/10 border border-yellow-200 dark:border-yellow-800">
                                <div className="text-sm font-medium text-yellow-700 dark:text-yellow-300 mb-1">Aguardando</div>
                                <div className="text-3xl font-bold text-yellow-900 dark:text-yellow-100">{queueStatus.waiting}</div>
                            </div>
                            <div className="p-4 rounded-lg bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950/20 dark:to-blue-900/10 border border-blue-200 dark:border-blue-800">
                                <div className="text-sm font-medium text-blue-700 dark:text-blue-300 mb-1">Chamados</div>
                                <div className="text-3xl font-bold text-blue-900 dark:text-blue-100">{queueStatus.called}</div>
                            </div>
                            <div className="p-4 rounded-lg bg-gradient-to-br from-green-50 to-green-100 dark:from-green-950/20 dark:to-green-900/10 border border-green-200 dark:border-green-800">
                                <div className="text-sm font-medium text-green-700 dark:text-green-300 mb-1">Em Atendimento</div>
                                <div className="text-3xl font-bold text-green-900 dark:text-green-100">{queueStatus.in_service}</div>
                            </div>
                            <div className="p-4 rounded-lg bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-950/20 dark:to-purple-900/10 border border-purple-200 dark:border-purple-800">
                                <div className="text-sm font-medium text-purple-700 dark:text-purple-300 mb-1">Finalizados</div>
                                <div className="text-3xl font-bold text-purple-900 dark:text-purple-100">{queueStatus.finished}</div>
                            </div>
                            <div className="p-4 rounded-lg bg-gradient-to-br from-red-50 to-red-100 dark:from-red-950/20 dark:to-red-900/10 border border-red-200 dark:border-red-800">
                                <div className="text-sm font-medium text-red-700 dark:text-red-300 mb-1">Cancelados</div>
                                <div className="text-3xl font-bold text-red-900 dark:text-red-100">{queueStatus.canceled}</div>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Pacientes Recentes */}
                    <Card className="border-0 shadow-lg">
                        <CardHeader>
                            <div className="flex justify-between items-center">
                                <CardTitle className="text-xl">Pacientes Recentes</CardTitle>
                                <Link href="/patients">
                                    <Button variant="outline" size="sm" className="hover:bg-primary hover:text-primary-foreground transition-colors">
                                        Ver Todos
                                    </Button>
                                </Link>
                            </div>
                        </CardHeader>
                        <CardContent>
                            {recentPatients.length === 0 ? (
                                <div className="text-center py-8">
                                    <Users className="h-12 w-12 text-muted-foreground mx-auto mb-3 opacity-50" />
                                    <p className="text-muted-foreground">Nenhum paciente cadastrado</p>
                                </div>
                            ) : (
                                <div className="space-y-2">
                                    {recentPatients.map((patient, index) => (
                                        <div 
                                            key={patient.id} 
                                            className="flex justify-between items-center p-3 rounded-lg border hover:bg-accent/50 transition-all duration-200 hover:shadow-sm"
                                            style={{ animationDelay: `${index * 50}ms` }}
                                        >
                                            <div className="flex items-center gap-3">
                                                <div className="h-10 w-10 rounded-full bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center">
                                                    <Users className="h-5 w-5 text-primary" />
                                                </div>
                                                <div>
                                                    <div className="font-semibold">{patient.name}</div>
                                                    <div className="text-sm text-muted-foreground">
                                                        {new Date(patient.created_at).toLocaleDateString('pt-BR')}
                                                    </div>
                                                </div>
                                            </div>
                                            <Link href={`/patients/${patient.id}`}>
                                                <Button variant="ghost" size="sm" className="hover:bg-primary hover:text-primary-foreground">
                                                    Ver
                                                </Button>
                                            </Link>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {/* Estatísticas por Serviço */}
                    <Card className="border-0 shadow-lg">
                        <CardHeader>
                            <CardTitle className="text-xl">Estatísticas por Serviço</CardTitle>
                        </CardHeader>
                        <CardContent>
                            {serviceStats.length === 0 ? (
                                <div className="text-center py-8">
                                    <Stethoscope className="h-12 w-12 text-muted-foreground mx-auto mb-3 opacity-50" />
                                    <p className="text-muted-foreground">Nenhum serviço cadastrado</p>
                                </div>
                            ) : (
                                <div className="space-y-3">
                                    {serviceStats.map((stat, index) => (
                                        <div 
                                            key={stat.service.id} 
                                            className="p-4 rounded-lg border bg-gradient-to-r from-background to-accent/30 hover:shadow-md transition-all duration-200"
                                            style={{ animationDelay: `${index * 50}ms` }}
                                        >
                                            <div className="font-semibold text-lg mb-2">{stat.service.name}</div>
                                            <div className="flex gap-6 mt-3">
                                                <div className="flex items-center gap-2">
                                                    <div className="h-2 w-2 rounded-full bg-primary"></div>
                                                    <span className="text-sm text-muted-foreground">
                                                        Total: <strong className="text-foreground">{stat.total_entries}</strong>
                                                    </span>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <div className="h-2 w-2 rounded-full bg-green-500"></div>
                                                    <span className="text-sm text-muted-foreground">
                                                        Ativos: <strong className="text-foreground">{stat.active_entries}</strong>
                                                    </span>
                                                </div>
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
            
            <div className="container mx-auto p-6 space-y-6">
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                            Dashboard Triagista
                        </h1>
                        <p className="text-muted-foreground mt-2">Gerencie triagens e fila de pacientes</p>
                    </div>
                    <Link href="/triage/create">
                        <Button className="shadow-lg hover:shadow-xl transition-all duration-300">
                            <Plus className="mr-2 h-4 w-4" />
                            Nova Triagem
                        </Button>
                    </Link>
                </div>

                {/* Estatísticas */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Card className="relative overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 bg-gradient-to-br from-indigo-50 to-indigo-100 dark:from-indigo-950/20 dark:to-indigo-900/10">
                        <div className="absolute top-0 right-0 w-20 h-20 bg-indigo-500/10 rounded-full -mr-10 -mt-10"></div>
                        <CardHeader className="pb-2 relative z-10">
                            <CardTitle className="text-sm font-medium text-indigo-700 dark:text-indigo-300">Total de Triagens</CardTitle>
                        </CardHeader>
                        <CardContent className="relative z-10">
                            <div className="text-3xl font-bold text-indigo-900 dark:text-indigo-100">{triageStatistics.total_triages}</div>
                            <div className="mt-3 text-xs text-indigo-600 dark:text-indigo-400">Todas as triagens</div>
                        </CardContent>
                    </Card>
                    <Card className="relative overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 bg-gradient-to-br from-cyan-50 to-cyan-100 dark:from-cyan-950/20 dark:to-cyan-900/10">
                        <div className="absolute top-0 right-0 w-20 h-20 bg-cyan-500/10 rounded-full -mr-10 -mt-10"></div>
                        <CardHeader className="pb-2 relative z-10">
                            <CardTitle className="text-sm font-medium text-cyan-700 dark:text-cyan-300">Triagens Hoje</CardTitle>
                        </CardHeader>
                        <CardContent className="relative z-10">
                            <div className="text-3xl font-bold text-cyan-900 dark:text-cyan-100">{triageStatistics.triages_today}</div>
                            <div className="mt-3 text-xs text-cyan-600 dark:text-cyan-400">Realizadas hoje</div>
                        </CardContent>
                    </Card>
                    <Card className="relative overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 bg-gradient-to-br from-teal-50 to-teal-100 dark:from-teal-950/20 dark:to-teal-900/10">
                        <div className="absolute top-0 right-0 w-20 h-20 bg-teal-500/10 rounded-full -mr-10 -mt-10"></div>
                        <CardHeader className="pb-2 relative z-10">
                            <CardTitle className="text-sm font-medium text-teal-700 dark:text-teal-300">Score Médio</CardTitle>
                        </CardHeader>
                        <CardContent className="relative z-10">
                            <div className="text-3xl font-bold text-teal-900 dark:text-teal-100">{triageStatistics.average_score.toFixed(1)}</div>
                            <div className="mt-3 text-xs text-teal-600 dark:text-teal-400">Prioridade média</div>
                        </CardContent>
                    </Card>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Fila para Triagem */}
                    <Card className="border-0 shadow-lg">
                        <CardHeader>
                            <CardTitle className="text-xl">Fila para Triagem</CardTitle>
                        </CardHeader>
                        <CardContent>
                            {queueForScreening.length === 0 ? (
                                <div className="text-center py-8">
                                    <Clock className="h-12 w-12 text-muted-foreground mx-auto mb-3 opacity-50" />
                                    <p className="text-muted-foreground">Nenhum paciente aguardando triagem</p>
                                </div>
                            ) : (
                                <div className="space-y-3">
                                    {queueForScreening.slice(0, 10).map((entry, index) => (
                                        <div 
                                            key={entry.id} 
                                            className="p-4 rounded-lg border bg-gradient-to-r from-background to-accent/30 hover:shadow-md transition-all duration-200"
                                            style={{ animationDelay: `${index * 50}ms` }}
                                        >
                                            <div className="font-semibold text-lg mb-1">{entry.patient?.name || 'Paciente não encontrado'}</div>
                                            <div className="text-sm text-muted-foreground mb-3">
                                                {entry.service?.name || 'Serviço não encontrado'}
                                            </div>
                                            <Badge variant="outline" className="bg-primary/10">
                                                Prioridade: {entry.priority}
                                            </Badge>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {/* Triagens Recentes */}
                    <Card className="border-0 shadow-lg">
                        <CardHeader>
                            <CardTitle className="text-xl">Triagens Recentes</CardTitle>
                        </CardHeader>
                        <CardContent>
                            {recentTriages.length === 0 ? (
                                <div className="text-center py-8">
                                    <CheckCircle className="h-12 w-12 text-muted-foreground mx-auto mb-3 opacity-50" />
                                    <p className="text-muted-foreground">Nenhuma triagem realizada</p>
                                </div>
                            ) : (
                                <div className="space-y-3">
                                    {recentTriages.map((triage, index) => (
                                        <div 
                                            key={triage.id} 
                                            className="p-4 rounded-lg border bg-gradient-to-r from-background to-accent/30 hover:shadow-md transition-all duration-200"
                                            style={{ animationDelay: `${index * 50}ms` }}
                                        >
                                            <div className="font-semibold text-lg mb-2">{triage.patient?.name || 'Paciente não encontrado'}</div>
                                            <div className="flex items-center gap-3">
                                                <Badge className="bg-primary text-primary-foreground">Score: {triage.score}</Badge>
                                                <span className="text-sm text-muted-foreground">
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
            
            <div className="container mx-auto p-6 space-y-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                            Dashboard Médico
                        </h1>
                        <p className="text-muted-foreground mt-2">Gerencie sua fila de atendimento</p>
                    </div>
                </div>

                {/* Resumo */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Card className="relative overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 bg-gradient-to-br from-yellow-50 to-yellow-100 dark:from-yellow-950/20 dark:to-yellow-900/10">
                        <div className="absolute top-0 right-0 w-20 h-20 bg-yellow-500/10 rounded-full -mr-10 -mt-10"></div>
                        <CardHeader className="pb-2 relative z-10">
                            <CardTitle className="text-sm font-medium text-yellow-700 dark:text-yellow-300">Aguardando</CardTitle>
                        </CardHeader>
                        <CardContent className="relative z-10">
                            <div className="text-3xl font-bold text-yellow-900 dark:text-yellow-100">{summary.waiting}</div>
                            <div className="mt-3 flex items-center gap-2">
                                <Clock className="h-5 w-5 text-yellow-600 dark:text-yellow-400" />
                                <span className="text-xs text-yellow-600 dark:text-yellow-400">Na fila</span>
                            </div>
                        </CardContent>
                    </Card>
                    <Card className="relative overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950/20 dark:to-blue-900/10">
                        <div className="absolute top-0 right-0 w-20 h-20 bg-blue-500/10 rounded-full -mr-10 -mt-10"></div>
                        <CardHeader className="pb-2 relative z-10">
                            <CardTitle className="text-sm font-medium text-blue-700 dark:text-blue-300">Chamados</CardTitle>
                        </CardHeader>
                        <CardContent className="relative z-10">
                            <div className="text-3xl font-bold text-blue-900 dark:text-blue-100">{summary.called}</div>
                            <div className="mt-3 flex items-center gap-2">
                                <Phone className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                                <span className="text-xs text-blue-600 dark:text-blue-400">Aguardando início</span>
                            </div>
                        </CardContent>
                    </Card>
                    <Card className="relative overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 bg-gradient-to-br from-green-50 to-green-100 dark:from-green-950/20 dark:to-green-900/10">
                        <div className="absolute top-0 right-0 w-20 h-20 bg-green-500/10 rounded-full -mr-10 -mt-10"></div>
                        <CardHeader className="pb-2 relative z-10">
                            <CardTitle className="text-sm font-medium text-green-700 dark:text-green-300">Em Atendimento</CardTitle>
                        </CardHeader>
                        <CardContent className="relative z-10">
                            <div className="text-3xl font-bold text-green-900 dark:text-green-100">{summary.in_service}</div>
                            <div className="mt-3 flex items-center gap-2">
                                <Stethoscope className="h-5 w-5 text-green-600 dark:text-green-400" />
                                <span className="text-xs text-green-600 dark:text-green-400">Ativos</span>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Fila Atual */}
                    <Card className="border-0 shadow-lg">
                        <CardHeader>
                            <div className="flex justify-between items-center">
                                <CardTitle className="text-xl">Fila de Atendimento</CardTitle>
                                <Button 
                                    onClick={handleCallNext} 
                                    size="sm" 
                                    variant="secondary"
                                    className="shadow-md hover:shadow-lg transition-all duration-300"
                                >
                                    <Phone className="mr-2 h-4 w-4" />
                                    Chamar Próximo
                                </Button>
                            </div>
                        </CardHeader>
                        <CardContent>
                            {currentQueue.length === 0 ? (
                                <div className="text-center py-8">
                                    <Stethoscope className="h-12 w-12 text-muted-foreground mx-auto mb-3 opacity-50" />
                                    <p className="text-muted-foreground">Nenhum paciente na fila</p>
                                </div>
                            ) : (
                                <div className="space-y-3">
                                    {currentQueue.map((entry, index) => (
                                        <div 
                                            key={entry.id} 
                                            className={`p-4 rounded-lg border transition-all duration-200 hover:shadow-md ${
                                                entry.status === 'called' 
                                                    ? 'bg-gradient-to-r from-yellow-50 to-yellow-100 dark:from-yellow-950/20 dark:to-yellow-900/10 border-yellow-200 dark:border-yellow-800' 
                                                    : 'bg-gradient-to-r from-green-50 to-green-100 dark:from-green-950/20 dark:to-green-900/10 border-green-200 dark:border-green-800'
                                            }`}
                                            style={{ animationDelay: `${index * 50}ms` }}
                                        >
                                            <div className="font-semibold text-lg mb-1">{entry.patient?.name || 'Paciente não encontrado'}</div>
                                            <div className="text-sm text-muted-foreground mb-3">
                                                {entry.service?.name || 'Serviço não encontrado'}
                                            </div>
                                            <div className="flex gap-2 items-center">
                                                {entry.status === 'called' && (
                                                    <Button 
                                                        size="sm" 
                                                        onClick={() => handleStart(entry.id)}
                                                        className="shadow-sm hover:shadow-md transition-all"
                                                    >
                                                        <Play className="mr-1 h-3 w-3" />
                                                        Iniciar
                                                    </Button>
                                                )}
                                                {entry.status === 'in_service' && (
                                                    <Button 
                                                        size="sm" 
                                                        onClick={() => handleFinish(entry.id)}
                                                        className="bg-green-600 hover:bg-green-700 shadow-sm hover:shadow-md transition-all"
                                                    >
                                                        <CheckCircle className="mr-1 h-3 w-3" />
                                                        Finalizar
                                                    </Button>
                                                )}
                                                <Badge variant="outline" className="ml-auto">
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
                    <Card className="border-0 shadow-lg">
                        <CardHeader>
                            <CardTitle className="text-xl">Pacientes Recentes</CardTitle>
                        </CardHeader>
                        <CardContent>
                            {recentPatients.length === 0 ? (
                                <div className="text-center py-8">
                                    <Users className="h-12 w-12 text-muted-foreground mx-auto mb-3 opacity-50" />
                                    <p className="text-muted-foreground">Nenhum paciente cadastrado</p>
                                </div>
                            ) : (
                                <div className="space-y-2">
                                    {recentPatients.map((patient, index) => (
                                        <div 
                                            key={patient.id} 
                                            className="flex justify-between items-center p-3 rounded-lg border hover:bg-accent/50 transition-all duration-200 hover:shadow-sm"
                                            style={{ animationDelay: `${index * 50}ms` }}
                                        >
                                            <div className="flex items-center gap-3">
                                                <div className="h-10 w-10 rounded-full bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center">
                                                    <Users className="h-5 w-5 text-primary" />
                                                </div>
                                                <div>
                                                    <div className="font-semibold">{patient.name}</div>
                                                    <div className="text-sm text-muted-foreground">
                                                        {new Date(patient.created_at).toLocaleDateString('pt-BR')}
                                                    </div>
                                                </div>
                                            </div>
                                            <Link href={`/patients/${patient.id}`}>
                                                <Button variant="ghost" size="sm" className="hover:bg-primary hover:text-primary-foreground">
                                                    Ver
                                                </Button>
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
