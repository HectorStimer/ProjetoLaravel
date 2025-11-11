import { Head, Link, useForm } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import InputError from '@/components/input-error';
import { type Patient } from '@/types';
import { dashboard } from '@/routes';
import { type BreadcrumbItem } from '@/types';

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
        title: `Editar: ${patient.name}`,
        href: `/patients/${patient.id}/edit`,
    },
];

export default function PatientsEdit({ patient }: Props) {
    const { data, setData, put, processing, errors } = useForm({
        name: patient.name,
        document: patient.document || '',
        birth_date: patient.birth_date,
        phone: patient.phone || '',
    });

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        put(`/patients/${patient.id}`);
    }

    return (
        <AppLayout breadcrumbs={breadcrumbs(patient)}>
            <Head title="Editar Paciente" />
            
            <div className="container mx-auto p-6 max-w-2xl">
                <Card>
                    <CardHeader>
                        <CardTitle>Editar Paciente</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <Label htmlFor="name">Nome *</Label>
                                <Input
                                    id="name"
                                    value={data.name}
                                    onChange={(e) => setData('name', e.target.value)}
                                    required
                                />
                                <InputError message={errors.name} />
                            </div>

                            <div>
                                <Label htmlFor="document">CPF</Label>
                                <Input
                                    id="document"
                                    value={data.document}
                                    onChange={(e) => setData('document', e.target.value)}
                                />
                                <InputError message={errors.document} />
                            </div>

                            <div>
                                <Label htmlFor="birth_date">Data de Nascimento *</Label>
                                <Input
                                    id="birth_date"
                                    type="date"
                                    value={data.birth_date}
                                    onChange={(e) => setData('birth_date', e.target.value)}
                                    required
                                />
                                <InputError message={errors.birth_date} />
                            </div>

                            <div>
                                <Label htmlFor="phone">Telefone</Label>
                                <Input
                                    id="phone"
                                    value={data.phone}
                                    onChange={(e) => setData('phone', e.target.value)}
                                />
                                <InputError message={errors.phone} />
                            </div>

                            <div className="flex gap-2 justify-end">
                                <Link href="/patients">
                                    <Button type="button" variant="outline">
                                        Cancelar
                                    </Button>
                                </Link>
                                <Button type="submit" disabled={processing}>
                                    {processing ? 'Salvando...' : 'Salvar'}
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}



