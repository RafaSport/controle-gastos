import { auth } from '@/lib/auth';
import { redirect } from 'next/navigation';
import PaginaAdminCliente from './PaginaAdminCliente';

export default async function PaginaAdmin() {
    const sessao = await auth();

    if (!sessao?.user) redirect('/login');

    // Somente admin acessa esta página
    if ((sessao.user as any).papel !== 'ADMIN') redirect('/comprador');

    return <PaginaAdminCliente />;
}
