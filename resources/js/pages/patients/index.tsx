import { Head, Link, router } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { type Patient } from '@/types';
import { Plus, Edit, Trash2, Users } from 'lucide-react';
import { dashboard } from '@/routes';
import { type BreadcrumbItem } from '@/types';

interface Props {
    patients: Patient[];
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: dashboard().url,
    },
    {
        title: 'Pacientes',
        href: '/patients',
    },
];

export default function PatientsIndex({ patients }: Props) {
    function handleDelete(id: number) {
        if (confirm('Tem certeza que deseja deletar este paciente?')) {
            router.delete(`/patients/${id}`);
        }
    }

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Pacientes" />
            
            <div className="container mx-auto p-6 space-y-6">
                {/* Cabeçalho */}
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                            Pacientes
                        </h1>
                        <p className="text-muted-foreground mt-2">Gerencie o cadastro de pacientes</p>
                    </div>
                    <Link href="/patients/create">
                        <Button className="shadow-lg hover:shadow-xl transition-all duration-300">
                            <Plus className="mr-2 h-4 w-4" />
                            Novo Paciente
                        </Button>
                    </Link>
                </div>

                {/* Lista de Pacientes */}
                {patients.length === 0 ? (
                    <Card className="border-0 shadow-lg">
                        <CardContent className="p-12 text-center">
                            <Users className="h-16 w-16 text-muted-foreground mx-auto mb-4 opacity-50" />
                            <p className="text-lg font-semibold text-muted-foreground mb-2">Nenhum paciente cadastrado</p>
                            <p className="text-sm text-muted-foreground">Comece adicionando seu primeiro paciente</p>
                        </CardContent>
                    </Card>
                ) : (
                    <div className="grid gap-4">
                        {patients.map((patient, index) => (
                            <Card 
                                key={patient.id} 
                                className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
                                style={{ animationDelay: `${index * 30}ms` }}
                            >
                                <CardHeader>
                                    <div className="flex justify-between items-start">
                                        <div className="flex items-start gap-4 flex-1">
                                            <div className="h-12 w-12 rounded-full bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center flex-shrink-0">
                                                <Users className="h-6 w-6 text-primary" />
                                            </div>
                                            <div className="flex-1">
                                                <CardTitle className="text-xl mb-2">{patient.name}</CardTitle>
                                                <div className="space-y-1">
                                                    {patient.document && (
                                                        <p className="text-sm text-muted-foreground flex items-center gap-2">
                                                            <span className="font-medium">CPF:</span> {patient.document}
                                                        </p>
                                                    )}
                                                    <p className="text-sm text-muted-foreground flex items-center gap-2">
                                                        <span className="font-medium">Nascimento:</span> {new Date(patient.birth_date).toLocaleDateString('pt-BR')}
                                                    </p>
                                                    {patient.phone && (
                                                        <p className="text-sm text-muted-foreground flex items-center gap-2">
                                                            <span className="font-medium">Telefone:</span> {patient.phone}
                                                        </p>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex gap-2 ml-4">
                                            <Link href={`/patients/${patient.id}/edit`}>
                                                <Button variant="outline" size="sm" className="hover:bg-primary hover:text-primary-foreground transition-colors">
                                                    <Edit className="h-4 w-4" />
                                                </Button>
                                            </Link>
                                            <Button 
                                                variant="destructive" 
                                                size="sm"
                                                onClick={() => handleDelete(patient.id)}
                                                className="hover:bg-destructive/90 transition-colors"
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


