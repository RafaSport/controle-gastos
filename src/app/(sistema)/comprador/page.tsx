import { auth } from '@/lib/auth';
import { redirect } from 'next/navigation';
import PaginaCompradorCliente from './PaginaCompradorCliente';

export default async function PaginaComprador() {
    const sessao = await auth();

    // Redireciona se não estiver logado
    if (!sessao?.user) redirect('/login');

    // Somente compradores acessam esta página
    if ((sessao.user as any).papel !== 'COMPRADOR') redirect('/admin');

    return (
        <PaginaCompradorCliente
            usuarioId={(sessao.user as any).id}
            nomeUsuario={`${sessao.user.name}`}
        />
    );
}
