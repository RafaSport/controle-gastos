import { auth } from '@/lib/auth';
import { redirect } from 'next/navigation';
import PaginaCompradorAdminCliente from './PaginaCompradorAdminCliente';

export default async function PaginaCompradorAdmin({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const sessao = await auth();
    const { id } = await params;

    if (!sessao?.user) redirect('/login');
    if ((sessao.user as any).papel !== 'ADMIN') redirect('/comprador');

    return <PaginaCompradorAdminCliente usuarioId={id} />;
}
