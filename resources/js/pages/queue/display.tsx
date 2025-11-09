import { Head } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import { type QueueEntry, type Service } from '@/types';
import { Clock, User, Stethoscope, Phone } from 'lucide-react';

interface Props {
    waiting: QueueEntry[];
    called: QueueEntry[];
    inService: QueueEntry[];
    services: Service[];
    selectedServiceId?: number;
}

export default function QueueDisplay({ 
    waiting: initialWaiting, 
    called: initialCalled, 
    inService: initialInService,
    services,
    selectedServiceId 
}: Props) {
    const [waiting, setWaiting] = useState(initialWaiting);
    const [called, setCalled] = useState(initialCalled);
    const [inService, setInService] = useState(initialInService);
    const [currentTime, setCurrentTime] = useState(new Date());

    // Atualizar relógio a cada segundo
    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentTime(new Date());
        }, 1000);
        return () => clearInterval(timer);
    }, []);

    // Atualizar fila a cada 5 segundos
    useEffect(() => {
        const fetchQueue = async () => {
            try {
                const params = selectedServiceId ? { service_id: selectedServiceId } : {};
                const response = await fetch(`/api/display?${new URLSearchParams(params as any)}`);
                const data = await response.json();
                setWaiting(data.waiting || []);
                setCalled(data.called || []);
                setInService(data.inService || []);
            } catch (error) {
                console.error('Erro ao atualizar fila', error);
            }
        };

        fetchQueue();
        const interval = setInterval(fetchQueue, 5000);
        return () => clearInterval(interval);
    }, [selectedServiceId]);

    const formatTime = (date: Date) => {
        return date.toLocaleTimeString('pt-BR', { 
            hour: '2-digit', 
            minute: '2-digit',
            second: '2-digit'
        });
    };

    const formatDate = (date: Date) => {
        return date.toLocaleDateString('pt-BR', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    const getPriorityColor = (priority: number) => {
        if (priority <= 2) return 'text-red-600 bg-red-50 border-red-200';
        if (priority === 3) return 'text-yellow-600 bg-yellow-50 border-yellow-200';
        return 'text-blue-600 bg-blue-50 border-blue-200';
    };

    const getPriorityLabel = (priority: number) => {
        if (priority <= 2) return 'URGENTE';
        if (priority === 3) return 'NORMAL';
        return 'ROTINA';
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white">
            <Head title="Telão da Fila" />
            
            {/* Cabeçalho */}
            <div className="bg-black/50 backdrop-blur-sm border-b border-white/10">
                <div className="container mx-auto px-8 py-6">
                    <div className="flex justify-between items-center">
                        <div>
                            <h1 className="text-5xl font-bold mb-2 bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                                FILA DE ATENDIMENTO
                            </h1>
                            <p className="text-gray-300 text-xl">
                                {services.find(s => s.id === selectedServiceId)?.name || 'Todos os Serviços'}
                            </p>
                        </div>
                        <div className="text-right">
                            <div className="text-4xl font-bold text-cyan-400">
                                {formatTime(currentTime)}
                            </div>
                            <div className="text-lg text-gray-300 capitalize">
                                {formatDate(currentTime)}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-8 py-8">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Em Atendimento */}
                    <div className="lg:col-span-1">
                        <div className="bg-gradient-to-br from-green-500/20 to-green-600/10 rounded-2xl p-6 border border-green-500/30 shadow-2xl">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="p-3 bg-green-500/20 rounded-lg">
                                    <Stethoscope className="h-8 w-8 text-green-400" />
                                </div>
                                <div>
                                    <h2 className="text-2xl font-bold text-green-400">EM ATENDIMENTO</h2>
                                    <p className="text-gray-300 text-sm">{inService.length} paciente(s)</p>
                                </div>
                            </div>
                            <div className="space-y-4 max-h-[600px] overflow-y-auto">
                                {inService.length === 0 ? (
                                    <div className="text-center py-12 text-gray-400">
                                        <Stethoscope className="h-16 w-16 mx-auto mb-4 opacity-50" />
                                        <p>Nenhum paciente em atendimento</p>
                                    </div>
                                ) : (
                                    inService.map((entry) => (
                                        <div
                                            key={entry.id}
                                            className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20 hover:bg-white/20 transition-all duration-300"
                                        >
                                            <div className="flex justify-between items-start mb-2">
                                                <div className="flex items-center gap-2">
                                                    <User className="h-5 w-5 text-green-400" />
                                                    <span className="font-bold text-lg text-white">
                                                        {entry.patient?.name || 'N/A'}
                                                    </span>
                                                </div>
                                                <span className={`px-3 py-1 rounded-full text-xs font-bold border ${getPriorityColor(entry.priority)}`}>
                                                    {getPriorityLabel(entry.priority)}
                                                </span>
                                            </div>
                                            <div className="text-sm text-gray-300">
                                                <p>{entry.service?.name || 'N/A'}</p>
                                                {entry.started_at && (
                                                    <p className="mt-1 flex items-center gap-1">
                                                        <Clock className="h-3 w-3" />
                                                        Iniciado: {new Date(entry.started_at).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Chamados */}
                    <div className="lg:col-span-1">
                        <div className="bg-gradient-to-br from-yellow-500/20 to-yellow-600/10 rounded-2xl p-6 border border-yellow-500/30 shadow-2xl">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="p-3 bg-yellow-500/20 rounded-lg">
                                    <Phone className="h-8 w-8 text-yellow-400" />
                                </div>
                                <div>
                                    <h2 className="text-2xl font-bold text-yellow-400">CHAMADOS</h2>
                                    <p className="text-gray-300 text-sm">{called.length} paciente(s)</p>
                                </div>
                            </div>
                            <div className="space-y-4 max-h-[600px] overflow-y-auto">
                                {called.length === 0 ? (
                                    <div className="text-center py-12 text-gray-400">
                                        <Phone className="h-16 w-16 mx-auto mb-4 opacity-50" />
                                        <p>Nenhum paciente chamado</p>
                                    </div>
                                ) : (
                                    called.map((entry) => (
                                        <div
                                            key={entry.id}
                                            className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20 hover:bg-white/20 transition-all duration-300 animate-pulse"
                                        >
                                            <div className="flex justify-between items-start mb-2">
                                                <div className="flex items-center gap-2">
                                                    <User className="h-5 w-5 text-yellow-400" />
                                                    <span className="font-bold text-lg text-white">
                                                        {entry.patient?.name || 'N/A'}
                                                    </span>
                                                </div>
                                                <span className={`px-3 py-1 rounded-full text-xs font-bold border ${getPriorityColor(entry.priority)}`}>
                                                    {getPriorityLabel(entry.priority)}
                                                </span>
                                            </div>
                                            <div className="text-sm text-gray-300">
                                                <p>{entry.service?.name || 'N/A'}</p>
                                                {entry.called_at && (
                                                    <p className="mt-1 flex items-center gap-1">
                                                        <Clock className="h-3 w-3" />
                                                        Chamado: {new Date(entry.called_at).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Aguardando */}
                    <div className="lg:col-span-1">
                        <div className="bg-gradient-to-br from-blue-500/20 to-blue-600/10 rounded-2xl p-6 border border-blue-500/30 shadow-2xl">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="p-3 bg-blue-500/20 rounded-lg">
                                    <Clock className="h-8 w-8 text-blue-400" />
                                </div>
                                <div>
                                    <h2 className="text-2xl font-bold text-blue-400">AGUARDANDO</h2>
                                    <p className="text-gray-300 text-sm">{waiting.length} paciente(s)</p>
                                </div>
                            </div>
                            <div className="space-y-4 max-h-[600px] overflow-y-auto">
                                {waiting.length === 0 ? (
                                    <div className="text-center py-12 text-gray-400">
                                        <Clock className="h-16 w-16 mx-auto mb-4 opacity-50" />
                                        <p>Nenhum paciente aguardando</p>
                                    </div>
                                ) : (
                                    waiting.map((entry, index) => (
                                        <div
                                            key={entry.id}
                                            className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20 hover:bg-white/20 transition-all duration-300"
                                        >
                                            <div className="flex justify-between items-start mb-2">
                                                <div className="flex items-center gap-2">
                                                    <div className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-500/30 text-blue-300 font-bold text-sm">
                                                        {index + 1}
                                                    </div>
                                                    <span className="font-bold text-lg text-white">
                                                        {entry.patient?.name || 'N/A'}
                                                    </span>
                                                </div>
                                                <span className={`px-3 py-1 rounded-full text-xs font-bold border ${getPriorityColor(entry.priority)}`}>
                                                    {getPriorityLabel(entry.priority)}
                                                </span>
                                            </div>
                                            <div className="text-sm text-gray-300">
                                                <p>{entry.service?.name || 'N/A'}</p>
                                                {entry.arrived_at && (
                                                    <p className="mt-1 flex items-center gap-1">
                                                        <Clock className="h-3 w-3" />
                                                        Chegou: {new Date(entry.arrived_at).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

