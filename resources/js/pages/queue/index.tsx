import { Head, Link, router, useForm, usePage } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
    Select, 
    SelectContent, 
    SelectItem, 
    SelectTrigger, 
    SelectValue 
} from '@/components/ui/select';
import { 
    Dialog, 
    DialogContent, 
    DialogHeader, 
    DialogTitle, 
    DialogTrigger 
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import InputError from '@/components/input-error';
import { dashboard } from '@/routes';
import { type BreadcrumbItem, type QueueEntry, type Service, type Patient, type SharedData } from '@/types';
import { 
    Plus, 
    Phone, 
    Play, 
    CheckCircle, 
    X, 
    Clock,
    User,
    Stethoscope
} from 'lucide-react';
import { useEffect, useState } from 'react';

interface Props {
    queueEntries: QueueEntry[];
    services: Service[];
    patients: Patient[];
    selectedServiceId?: number;
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: dashboard().url,
    },
    {
        title: 'Fila',
        href: '/queue',
    },
];

export default function QueueIndex({ queueEntries, services, patients, selectedServiceId }: Props) {
    const { auth } = usePage<SharedData>().props;
    const user = auth.user;
    const isAdmin = user.function === 'admin';
    const isTriagist = user.function === 'triagist';
    const isDoctor = user.function === 'doctor';
    
    const [showAddModal, setShowAddModal] = useState(false);
    const [selectedServiceFilter, setSelectedServiceFilter] = useState<number | undefined>(
        selectedServiceId
    );
    const [entries, setEntries] = useState(queueEntries);
    const [isRefreshing, setIsRefreshing] = useState(false);

    useEffect(() => {
        setEntries(queueEntries);
    }, [queueEntries]);

    // Atualizar fila a cada 10 segundos usando Inertia
    useEffect(() => {
        const interval = window.setInterval(() => {
            const params = selectedServiceFilter ? { service_id: selectedServiceFilter } : {};
            router.reload({ 
                only: ['queueEntries'],
                data: params,
                preserveState: true,
                preserveScroll: true,
            });
        }, 10000);

        return () => window.clearInterval(interval);
    }, [selectedServiceFilter]);

    const { data, setData, post, processing, errors, reset } = useForm({
        patient_id: '',
        service_id: '',
        priority: '5',
    });

    function handleAddToQueue(e: React.FormEvent) {
        e.preventDefault();
        post('/queue', {
            onSuccess: () => {
                reset();
                setShowAddModal(false);
                router.reload({ 
                    only: ['queueEntries'],
                    data: selectedServiceFilter ? { service_id: selectedServiceFilter } : {},
                    preserveState: true,
                });
            },
        });
    }

    function handleCallNext() {
        router.post(
            '/queue/call-next',
            {
                service_id: selectedServiceFilter,
            },
            {
                preserveScroll: true,
                onSuccess: () => {
                    router.reload({ 
                        only: ['queueEntries'],
                        data: selectedServiceFilter ? { service_id: selectedServiceFilter } : {},
                        preserveState: true,
                    });
                },
            }
        );
    }

    function handleCall(id: number) {
        router.post(
            `/queue/${id}/call`,
            {},
            {
                preserveScroll: true,
                onSuccess: () => {
                    router.reload({ 
                        only: ['queueEntries'],
                        data: selectedServiceFilter ? { service_id: selectedServiceFilter } : {},
                        preserveState: true,
                    });
                },
            }
        );
    }

    function handleStart(id: number) {
        router.post(
            `/queue/${id}/start`,
            {},
            {
                preserveScroll: true,
                onSuccess: () => {
                    router.reload({ 
                        only: ['queueEntries'],
                        data: selectedServiceFilter ? { service_id: selectedServiceFilter } : {},
                        preserveState: true,
                    });
                },
            }
        );
    }

    function handleFinish(id: number) {
        router.post(
            `/queue/${id}/finish`,
            {},
            {
                preserveScroll: true,
                onSuccess: () => {
                    router.reload({ 
                        only: ['queueEntries'],
                        data: selectedServiceFilter ? { service_id: selectedServiceFilter } : {},
                        preserveState: true,
                    });
                },
            }
        );
    }

    function handleCancel(id: number) {
        if (confirm('Tem certeza que deseja remover este paciente da fila?')) {
            router.post(
                `/queue/${id}/cancel`,
                {},
                {
                    preserveScroll: true,
                    onSuccess: () => {
                        router.reload({ 
                            only: ['queueEntries'],
                            data: selectedServiceFilter ? { service_id: selectedServiceFilter } : {},
                            preserveState: true,
                        });
                    },
                }
            );
        }
    }

    function handleFilterChange(serviceId: string) {
        const id = serviceId === 'all' ? undefined : parseInt(serviceId);
        setSelectedServiceFilter(id);
        router.reload({ 
            only: ['queueEntries'],
            data: id ? { service_id: id } : {},
            preserveState: true,
        });
    }

    function getStatusBadge(status: QueueEntry['status']) {
        const variants: Record<QueueEntry['status'], { variant: 'default' | 'secondary' | 'destructive' | 'outline', label: string }> = {
            waiting: { variant: 'default', label: 'Aguardando' },
            called: { variant: 'secondary', label: 'Chamado' },
            in_service: { variant: 'outline', label: 'Em Atendimento' },
            finished: { variant: 'default', label: 'Finalizado' },
            canceled: { variant: 'destructive', label: 'Cancelado' },
        };

        const config = variants[status];
        return <Badge variant={config.variant}>{config.label}</Badge>;
    }

    function getPriorityLabel(priority: number) {
        const labels: Record<number, string> = {
            1: 'Emergência',
            2: 'Urgente',
            3: 'Alta',
            4: 'Média',
            5: 'Baixa',
        };
        return labels[priority] || `Prioridade ${priority}`;
    }

    const waitingEntries = entries.filter(e => e.status === 'waiting');
    const calledEntries = entries.filter(e => e.status === 'called');
    const inServiceEntries = entries.filter(e => e.status === 'in_service');

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Fila de Atendimento" />
            
            <div className="container mx-auto p-6 space-y-6">
                {/* Cabeçalho */}
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                            Fila de Atendimento
                        </h1>
                        <p className="text-muted-foreground mt-2">Gerencie a fila de pacientes</p>
                    </div>
                    <div className="flex gap-2">
                        {(isTriagist || isAdmin) && (
                            <Dialog open={showAddModal} onOpenChange={setShowAddModal}>
                                <DialogTrigger asChild>
                                    <Button>
                                        <Plus className="mr-2 h-4 w-4" />
                                        Adicionar à Fila
                                    </Button>
                                </DialogTrigger>
                                <DialogContent>
                                    <DialogHeader>
                                        <DialogTitle>Adicionar Paciente à Fila</DialogTitle>
                                    </DialogHeader>
                                    <form onSubmit={handleAddToQueue} className="space-y-4 mt-4">
                                        <div>
                                            <Label htmlFor="patient_id">Paciente *</Label>
                                            <Select
                                                value={data.patient_id}
                                                onValueChange={(value) => setData('patient_id', value)}
                                            >
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Selecione um paciente" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {patients.map((patient) => (
                                                        <SelectItem key={patient.id} value={patient.id.toString()}>
                                                            {patient.name} {patient.document && `- ${patient.document}`}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                            <InputError message={errors.patient_id} />
                                        </div>

                                        <div>
                                            <Label htmlFor="service_id">Serviço *</Label>
                                            <Select
                                                value={data.service_id}
                                                onValueChange={(value) => setData('service_id', value)}
                                            >
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Selecione um serviço" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {services.map((service) => (
                                                        <SelectItem key={service.id} value={service.id.toString()}>
                                                            {service.name}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                            <InputError message={errors.service_id} />
                                        </div>

                                        <div>
                                            <Label htmlFor="priority">Prioridade</Label>
                                            <Select
                                                value={data.priority}
                                                onValueChange={(value) => setData('priority', value)}
                                            >
                                                <SelectTrigger>
                                                    <SelectValue />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="1">1 - Emergência</SelectItem>
                                                    <SelectItem value="2">2 - Urgente</SelectItem>
                                                    <SelectItem value="3">3 - Alta</SelectItem>
                                                    <SelectItem value="4">4 - Média</SelectItem>
                                                    <SelectItem value="5">5 - Baixa</SelectItem>
                                                </SelectContent>
                                            </Select>
                                            <InputError message={errors.priority} />
                                        </div>

                                        <div className="flex gap-2 justify-end">
                                            <Button 
                                                type="button" 
                                                variant="outline"
                                                onClick={() => setShowAddModal(false)}
                                            >
                                                Cancelar
                                            </Button>
                                            <Button type="submit" disabled={processing}>
                                                {processing ? 'Adicionando...' : 'Adicionar'}
                                            </Button>
                                        </div>
                                    </form>
                                </DialogContent>
                            </Dialog>
                        )}
                    </div>
                </div>

                {/* Filtros e Ações */}
                <div className="flex gap-4">
                    <div className="flex-1">
                        <Label htmlFor="service_filter">Filtrar por Serviço</Label>
                        <Select
                            value={selectedServiceFilter?.toString() || 'all'}
                            onValueChange={handleFilterChange}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Todos os serviços" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">Todos os serviços</SelectItem>
                                {services.map((service) => (
                                    <SelectItem key={service.id} value={service.id.toString()}>
                                        {service.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                    {(isDoctor || isAdmin) && (
                        <div className="flex items-end">
                            <Button 
                                onClick={handleCallNext}
                                disabled={waitingEntries.length === 0 || isRefreshing}
                                variant="secondary"
                            >
                                <Phone className="mr-2 h-4 w-4" />
                                Chamar Próximo
                            </Button>
                        </div>
                    )}
                </div>

                {/* Estatísticas Rápidas */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Card className="relative overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 bg-gradient-to-br from-yellow-50 to-yellow-100 dark:from-yellow-950/20 dark:to-yellow-900/10">
                        <div className="absolute top-0 right-0 w-20 h-20 bg-yellow-500/10 rounded-full -mr-10 -mt-10"></div>
                        <CardHeader className="pb-2 relative z-10">
                            <CardTitle className="text-sm font-medium text-yellow-700 dark:text-yellow-300">Aguardando</CardTitle>
                        </CardHeader>
                        <CardContent className="relative z-10">
                            <div className="text-3xl font-bold text-yellow-900 dark:text-yellow-100">{waitingEntries.length}</div>
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
                            <div className="text-3xl font-bold text-blue-900 dark:text-blue-100">{calledEntries.length}</div>
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
                            <div className="text-3xl font-bold text-green-900 dark:text-green-100">{inServiceEntries.length}</div>
                            <div className="mt-3 flex items-center gap-2">
                                <Stethoscope className="h-5 w-5 text-green-600 dark:text-green-400" />
                                <span className="text-xs text-green-600 dark:text-green-400">Ativos</span>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Lista da Fila */}
                {queueEntries.length === 0 ? (
                    <Card className="border-0 shadow-lg">
                        <CardContent className="p-12 text-center">
                            <Clock className="h-16 w-16 text-muted-foreground mx-auto mb-4 opacity-50" />
                            <p className="text-lg font-semibold text-muted-foreground mb-2">Nenhum paciente na fila</p>
                            <p className="text-sm text-muted-foreground">A fila está vazia no momento</p>
                        </CardContent>
                    </Card>
                ) : (
                    <div className="space-y-4">
                        {/* Aguardando */}
                        {waitingEntries.length > 0 && (
                            <div>
                                <h2 className="text-xl font-semibold mb-3 flex items-center gap-2">
                                    <Clock className="h-5 w-5" />
                                    Aguardando ({waitingEntries.length})
                                </h2>
                                <div className="grid gap-3">
                                    {waitingEntries.map((entry, index) => (
                                        <Card 
                                            key={entry.id}
                                            className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 bg-gradient-to-r from-yellow-50/50 to-background dark:from-yellow-950/10 dark:to-background"
                                            style={{ animationDelay: `${index * 50}ms` }}
                                        >
                                            <CardContent className="p-4">
                                                <div className="flex justify-between items-start">
                                                    <div className="flex-1">
                                                        <div className="flex items-center gap-3 mb-2">
                                                            <User className="h-5 w-5 text-gray-500" />
                                                            <div>
                                                                <h3 className="font-semibold">
                                                                    {entry.patient?.name || 'Paciente não encontrado'}
                                                                </h3>
                                                                <p className="text-sm text-gray-500">
                                                                    {entry.service?.name || 'Serviço não encontrado'}
                                                                </p>
                                                            </div>
                                                        </div>
                                                        <div className="flex gap-2 items-center">
                                                            {getStatusBadge(entry.status)}
                                                            <Badge variant="outline">
                                                                {getPriorityLabel(entry.priority)}
                                                            </Badge>
                                                            <span className="text-xs text-gray-500">
                                                                Chegou: {new Date(entry.arrived_at).toLocaleTimeString('pt-BR')}
                                                            </span>
                                                        </div>
                                                    </div>
                                                    <div className="flex gap-2">
                                                        {(isDoctor || isAdmin) && (
                                                            <Button
                                                                size="sm"
                                                                variant="secondary"
                                                                onClick={() => handleCall(entry.id)}
                                                            >
                                                                <Phone className="h-4 w-4" />
                                                            </Button>
                                                        )}
                                                        {(isTriagist || isAdmin) && (
                                                            <Button
                                                                size="sm"
                                                                variant="destructive"
                                                                onClick={() => handleCancel(entry.id)}
                                                            >
                                                                <X className="h-4 w-4" />
                                                            </Button>
                                                        )}
                                                    </div>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Chamados */}
                        {calledEntries.length > 0 && (
                            <div>
                                <h2 className="text-xl font-semibold mb-3 flex items-center gap-2">
                                    <Phone className="h-5 w-5" />
                                    Chamados ({calledEntries.length})
                                </h2>
                                <div className="grid gap-3">
                                    {calledEntries.map((entry, index) => (
                                        <Card 
                                            key={entry.id} 
                                            className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 bg-gradient-to-r from-blue-50/50 to-background dark:from-blue-950/10 dark:to-background border-l-4 border-blue-500"
                                            style={{ animationDelay: `${index * 50}ms` }}
                                        >
                                            <CardContent className="p-4">
                                                <div className="flex justify-between items-start">
                                                    <div className="flex-1">
                                                        <div className="flex items-center gap-3 mb-2">
                                                            <User className="h-5 w-5 text-gray-500" />
                                                            <div>
                                                                <h3 className="font-semibold">
                                                                    {entry.patient?.name || 'Paciente não encontrado'}
                                                                </h3>
                                                                <p className="text-sm text-gray-500">
                                                                    {entry.service?.name || 'Serviço não encontrado'}
                                                                </p>
                                                            </div>
                                                        </div>
                                                        <div className="flex gap-2 items-center">
                                                            {getStatusBadge(entry.status)}
                                                            <span className="text-xs text-gray-500">
                                                                Chamado: {entry.called_at ? new Date(entry.called_at).toLocaleTimeString('pt-BR') : '-'}
                                                            </span>
                                                        </div>
                                                    </div>
                                                    <div className="flex gap-2">
                                                        {(isDoctor || isAdmin) && (
                                                            <Button
                                                                size="sm"
                                                                onClick={() => handleStart(entry.id)}
                                                            >
                                                                <Play className="h-4 w-4 mr-1" />
                                                                Iniciar
                                                            </Button>
                                                        )}
                                                        {(isTriagist || isAdmin) && (
                                                            <Button
                                                                size="sm"
                                                                variant="destructive"
                                                                onClick={() => handleCancel(entry.id)}
                                                            >
                                                                <X className="h-4 w-4" />
                                                            </Button>
                                                        )}
                                                    </div>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Em Atendimento */}
                        {inServiceEntries.length > 0 && (
                            <div>
                                <h2 className="text-xl font-semibold mb-3 flex items-center gap-2">
                                    <Stethoscope className="h-5 w-5" />
                                    Em Atendimento ({inServiceEntries.length})
                                </h2>
                                <div className="grid gap-3">
                                    {inServiceEntries.map((entry, index) => (
                                        <Card 
                                            key={entry.id} 
                                            className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 bg-gradient-to-r from-green-50/50 to-background dark:from-green-950/10 dark:to-background border-l-4 border-green-500"
                                            style={{ animationDelay: `${index * 50}ms` }}
                                        >
                                            <CardContent className="p-4">
                                                <div className="flex justify-between items-start">
                                                    <div className="flex-1">
                                                        <div className="flex items-center gap-3 mb-2">
                                                            <User className="h-5 w-5 text-gray-500" />
                                                            <div>
                                                                <h3 className="font-semibold">
                                                                    {entry.patient?.name || 'Paciente não encontrado'}
                                                                </h3>
                                                                <p className="text-sm text-gray-500">
                                                                    {entry.service?.name || 'Serviço não encontrado'}
                                                                </p>
                                                            </div>
                                                        </div>
                                                        <div className="flex gap-2 items-center">
                                                            {getStatusBadge(entry.status)}
                                                            <span className="text-xs text-gray-500">
                                                                Iniciado: {entry.started_at ? new Date(entry.started_at).toLocaleTimeString('pt-BR') : '-'}
                                                            </span>
                                                        </div>
                                                    </div>
                                                    <div className="flex gap-2">
                                                        {(isDoctor || isAdmin) && (
                                                            <Button
                                                                size="sm"
                                                                variant="default"
                                                                onClick={() => handleFinish(entry.id)}
                                                            >
                                                                <CheckCircle className="h-4 w-4 mr-1" />
                                                                Finalizar
                                                            </Button>
                                                        )}
                                                    </div>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </AppLayout>
    );
}

