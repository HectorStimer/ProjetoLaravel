// Components
import TextLink from '@/components/text-link';
import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';
import AuthLayout from '@/layouts/auth-layout';
import { logout } from '@/routes';
import { router } from '@inertiajs/react';
import { send } from '@/routes/verification';
import { Form, Head } from '@inertiajs/react';

export default function VerifyEmail({ status }: { status?: string }) {
    return (
        <AuthLayout
            title="Verify email"
            description="Please verify your email address by clicking on the link we just emailed to you."
        >
            <Head title="Email verification" />

            {status === 'verification-link-sent' && (
                <div className="mb-4 text-center text-sm font-medium text-green-600">
                    A new verification link has been sent to the email address
                    you provided during registration.
                </div>
            )}

            <Form {...send.form()} className="space-y-6 text-center">
                {({ processing }) => (
                    <>
                        <Button disabled={processing} variant="secondary">
                            {processing && <Spinner />}
                            Resend verification email
                        </Button>

                        <button
                            type="button"
                            onClick={async () => {
                                try {
                                    const token = localStorage.getItem('auth_token');
                                    if (token) {
                                        try {
                                            await fetch('/api/logout', {
                                                method: 'POST',
                                                headers: {
                                                    'Authorization': `Bearer ${token}`,
                                                    'Accept': 'application/json',
                                                    'Content-Type': 'application/json',
                                                },
                                                credentials: 'include',
                                            });
                                        } catch (e) {
                                            console.warn('API logout failed', e);
                                        }
                                    }
                                } catch (e) {
                                    console.warn('Error during logout cleanup', e);
                                } finally {
                                    // Clear local tokens and cookies then perform web logout
                                    try {
                                        localStorage.removeItem('auth_token');
                                    } catch (e) {
                                        // ignore
                                    }

                                    // Clear cookies
                                    document.cookie.split(';').forEach((c) => {
                                        document.cookie = c
                                            .replace(/^ +/, '')
                                            .replace(/=.*/, '=;expires=' + new Date().toUTCString() + ';path=/');
                                    });

                                    router.post(logout());
                                }
                            }}
                            className="mx-auto block text-sm text-blue-600 hover:underline"
                        >
                            Log out
                        </button>
                    </>
                )}
            </Form>
        </AuthLayout>
    );
}
