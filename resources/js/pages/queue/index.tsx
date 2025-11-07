import { Head, Link, router, useForm } from '@inertiajs/react';
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
import { type BreadcrumbItem, type QueueEntry, type Service, type Patient } from '@/types';
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
import api from '@/lib/api';

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
    const [showAddModal, setShowAddModal] = useState(false);
    const [selectedServiceFilter, setSelectedServiceFilter] = useState<number | undefined>(
        selectedServiceId
    );
    const [entries, setEntries] = useState(queueEntries);
    const [isRefreshing, setIsRefreshing] = useState(false);

    useEffect(() => {
        setEntries(queueEntries);
    }, [queueEntries]);

    async function fetchQueue(serviceId?: number) {
        try {
            setIsRefreshing(true);
            const params = serviceId ? { service_id: serviceId } : undefined;
            const { data } = await api.get<QueueEntry[]>('/queue', { params });
            setEntries(data);
        } catch (error) {
            console.error('Erro ao atualizar fila', error);
        } finally {
            setIsRefreshing(false);
        }
    }

    useEffect(() => {
        fetchQueue(selectedServiceFilter);
        const interval = window.setInterval(() => {
            fetchQueue(selectedServiceFilter);
        }, 10000);

        return () => window.clearInterval(interval);
        // eslint-disable-next-line react-hooks/exhaustive-deps
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
                fetchQueue(selectedServiceFilter);
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
                onSuccess: () => fetchQueue(selectedServiceFilter),
            }
        );
    }

    function handleCall(id: number) {
        router.post(
            `/queue/${id}/call`,
            {},
            {
                preserveScroll: true,
                onSuccess: () => fetchQueue(selectedServiceFilter),
            }
        );
    }

    function handleStart(id: number) {
        router.post(
            `/queue/${id}/start`,
            {},
            {
                preserveScroll: true,
                onSuccess: () => fetchQueue(selectedServiceFilter),
            }
        );
    }

    function handleFinish(id: number) {
        router.post(
            `/queue/${id}/finish`,
            {},
            {
                preserveScroll: true,
                onSuccess: () => fetchQueue(selectedServiceFilter),
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
                    onSuccess: () => fetchQueue(selectedServiceFilter),
                }
            );
        }
    }

    function handleFilterChange(serviceId: string) {
        const id = serviceId === 'all' ? undefined : parseInt(serviceId);
        setSelectedServiceFilter(id);
        fetchQueue(id);
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
            
            <div className="container mx-auto p-6">
                {/* Cabeçalho */}
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-3xl font-bold">Fila de Atendimento</h1>
                    <div className="flex gap-2">
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
                    </div>
                </div>

                {/* Filtros e Ações */}
                <div className="flex gap-4 mb-6">
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
                </div>

                {/* Estatísticas Rápidas */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                    <Card>
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-medium">Aguardando</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{waitingEntries.length}</div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-medium">Chamados</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{calledEntries.length}</div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-medium">Em Atendimento</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{inServiceEntries.length}</div>
                        </CardContent>
                    </Card>
                </div>

                {/* Lista da Fila */}
                {queueEntries.length === 0 ? (
                    <Card>
                        <CardContent className="p-6 text-center text-gray-500">
                            Nenhum paciente na fila no momento.
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
                                    {waitingEntries.map((entry) => (
                                        <Card key={entry.id}>
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
                                                        <Button
                                                            size="sm"
                                                            variant="secondary"
                                                            onClick={() => handleCall(entry.id)}
                                                        >
                                                            <Phone className="h-4 w-4" />
                                                        </Button>
                                                        <Button
                                                            size="sm"
                                                            variant="destructive"
                                                            onClick={() => handleCancel(entry.id)}
                                                        >
                                                            <X className="h-4 w-4" />
                                                        </Button>
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
                                    {calledEntries.map((entry) => (
                                        <Card key={entry.id} className="border-yellow-500">
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
                                                        <Button
                                                            size="sm"
                                                            onClick={() => handleStart(entry.id)}
                                                        >
                                                            <Play className="h-4 w-4 mr-1" />
                                                            Iniciar
                                                        </Button>
                                                        <Button
                                                            size="sm"
                                                            variant="destructive"
                                                            onClick={() => handleCancel(entry.id)}
                                                        >
                                                            <X className="h-4 w-4" />
                                                        </Button>
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
                                    {inServiceEntries.map((entry) => (
                                        <Card key={entry.id} className="border-green-500">
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
                                                        <Button
                                                            size="sm"
                                                            variant="default"
                                                            onClick={() => handleFinish(entry.id)}
                                                        >
                                                            <CheckCircle className="h-4 w-4 mr-1" />
                                                            Finalizar
                                                        </Button>
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

