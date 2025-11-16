import InputError from '@/components/input-error';
import TextLink from '@/components/text-link';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/ui/spinner';
import AuthLayout from '@/layouts/auth-layout';
import { register, login, request } from '@/routes';
import { Form, Head } from '@inertiajs/react';

interface LoginProps {
    status?: string;
    canResetPassword: boolean;
    canRegister: boolean;
}

export default function Login({
    status,
    canResetPassword,
    canRegister,
}: LoginProps) {
    return (
        <AuthLayout
            title="Bem-vindo de volta"
            description="Entre com suas credenciais para acessar o sistema"
        >
            <Head title="Login" />

            <div className="space-y-6">
                {status && (
                    <div className="p-4 rounded-lg bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-800 text-center text-sm font-medium text-green-700 dark:text-green-300">
                        {status}
                    </div>
                )}

                <Form
                    action={login.url()}
                    method="post"
                    resetOnSuccess={['password']}
                    className="flex flex-col gap-6"
                >
                    {({ processing, errors }) => (
                        <>
                            <div className="grid gap-6">
                                <div className="grid gap-2">
                                    <Label htmlFor="email" className="text-sm font-semibold">Email</Label>
                                    <Input
                                        id="email"
                                        type="email"
                                        name="email"
                                        required
                                        autoFocus
                                        tabIndex={1}
                                        autoComplete="email"
                                        placeholder="seu@email.com"
                                        className="h-11 transition-all duration-200 focus:ring-2 focus:ring-primary/20"
                                    />
                                    <InputError message={errors.email} />
                                </div>

                                <div className="grid gap-2">
                                    <div className="flex items-center justify-between">
                                        <Label htmlFor="password" className="text-sm font-semibold">Senha</Label>
                                        {canResetPassword && (
                                            <TextLink
                                                href="/forgot-password"
                                                className="text-sm text-primary hover:underline"
                                                tabIndex={5}
                                            >
                                                Esqueceu a senha?
                                            </TextLink>
                                        )}
                                    </div>
                                    <Input
                                        id="password"
                                        type="password"
                                        name="password"
                                        required
                                        tabIndex={2}
                                        autoComplete="current-password"
                                        placeholder="••••••••"
                                        className="h-11 transition-all duration-200 focus:ring-2 focus:ring-primary/20"
                                    />
                                    <InputError message={errors.password} />
                                </div>

                                <div className="flex items-center space-x-3">
                                    <Checkbox
                                        id="remember"
                                        name="remember"
                                        tabIndex={3}
                                    />
                                    <Label htmlFor="remember" className="text-sm cursor-pointer">Lembrar-me</Label>
                                </div>

                                <Button
                                    type="submit"
                                    className="mt-2 w-full h-11 shadow-lg hover:shadow-xl transition-all duration-300 bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary"
                                    tabIndex={4}
                                    disabled={processing}
                                    data-test="login-button"
                                >
                                    {processing ? (
                                        <>
                                            <Spinner />
                                            <span className="ml-2">Entrando...</span>
                                        </>
                                    ) : (
                                        'Entrar'
                                    )}
                                </Button>
                            </div>

                            {canRegister && (
                                <div className="text-center text-sm text-muted-foreground pt-4 border-t">
                                    Não tem uma conta?{' '}
                                    <TextLink href={register()} tabIndex={5} className="text-primary font-semibold hover:underline">
                                        Criar conta
                                    </TextLink>
                                </div>
                            )}
                        </>
                    )}
                </Form>
            </div>
        </AuthLayout>
    );
}
