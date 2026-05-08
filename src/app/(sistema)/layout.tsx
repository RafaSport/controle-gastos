import { auth } from '@/lib/auth-server';
import { redirect } from 'next/navigation';

export default async function SistemaLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const sessao = await auth();
    if (!sessao) redirect('/login');
    return <>{children}</>;
}