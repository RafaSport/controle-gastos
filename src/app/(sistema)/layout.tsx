import { auth } from '@/lib/auth';
import { redirect } from 'next/navigation';

// Layout protegido — redireciona para login se não houver sessão
export default async function SistemaLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const sessao = await auth();

    if (!sessao) {
        redirect('/login');
    }

    return <>{children}</>;
}
