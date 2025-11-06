import { Head, Link, useForm } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { 
    Select, 
    SelectContent, 
    SelectItem, 
    SelectTrigger, 
    SelectValue 
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import InputError from '@/components/input-error';
import { dashboard } from '@/routes';
import { type BreadcrumbItem, type Service, type Patient } from '@/types';

interface Props {
    patients: Patient[];
    services: Service[];
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
    {
        title: 'Nova Triagem',
        href: '/triage/create',
    },
];

export default function TriageCreate({ patients, services }: Props) {
    const { data, setData, post, processing, errors } = useForm({
        patient_id: '',
        score: '5',
        notes: '',
        service_id: services.length > 0 ? services[0].id.toString() : '',
        add_to_queue: false,
    });

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        post('/triage');
    }

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Nova Triagem" />
            
            <div className="container mx-auto p-6 max-w-2xl">
                <Card>
                    <CardHeader>
                        <CardTitle>Nova Triagem</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-4">
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
                                <Label htmlFor="score">Score de Triagem *</Label>
                                <Select
                                    value={data.score}
                                    onValueChange={(value) => setData('score', value)}
                                >
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="1">1 - Emergência (Vermelho)</SelectItem>
                                        <SelectItem value="2">2 - Urgente (Laranja)</SelectItem>
                                        <SelectItem value="3">3 - Alta (Amarelo)</SelectItem>
                                        <SelectItem value="4">4 - Média (Azul)</SelectItem>
                                        <SelectItem value="5">5 - Baixa (Verde)</SelectItem>
                                    </SelectContent>
                                </Select>
                                <InputError message={errors.score} />
                                <p className="text-xs text-gray-500 mt-1">
                                    Score 1 = maior urgência, Score 5 = menor urgência
                                </p>
                            </div>

                            <div>
                                <Label htmlFor="notes">Notas</Label>
                                <Input
                                    id="notes"
                                    value={data.notes}
                                    onChange={(e) => setData('notes', e.target.value)}
                                    placeholder="Observações sobre a triagem..."
                                />
                                <InputError message={errors.notes} />
                            </div>

                            <div className="space-y-2">
                                <div className="flex items-center space-x-2">
                                    <Checkbox
                                        id="add_to_queue"
                                        checked={data.add_to_queue}
                                        onCheckedChange={(checked) => setData('add_to_queue', checked as boolean)}
                                    />
                                    <Label htmlFor="add_to_queue" className="cursor-pointer">
                                        Adicionar paciente à fila automaticamente
                                    </Label>
                                </div>
                                
                                {data.add_to_queue && services.length > 0 && (
                                    <div className="ml-6">
                                        <Label htmlFor="service_id">Serviço</Label>
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
                                )}
                            </div>

                            <div className="flex gap-2 justify-end">
                                <Link href="/triage">
                                    <Button type="button" variant="outline">
                                        Cancelar
                                    </Button>
                                </Link>
                                <Button type="submit" disabled={processing}>
                                    {processing ? 'Salvando...' : 'Salvar Triagem'}
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}

