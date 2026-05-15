import { auth } from '@/lib/auth';
import Footer from '@/components/layout/Footer';
import { redirect } from 'next/navigation';

export default async function SistemaLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const sessao = await auth();
    if (!sessao) redirect('/login');

    return (
        <div className="min-h-screen bg-zinc-950 flex flex-col">
            <div className="flex-1">{children}</div>
            <Footer />
        </div>
    );
}
