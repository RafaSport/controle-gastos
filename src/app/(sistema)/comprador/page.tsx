import { auth } from '@/lib/auth-server';
import { redirect } from 'next/navigation';
import PaginaCompradorCliente from './PaginaCompradorCliente';

export default async function PaginaComprador() {
    const sessao = await auth();
    if (!sessao?.user) redirect('/login');
    if ((sessao.user as any).papel !== 'COMPRADOR') redirect('/admin');

    return (
        <PaginaCompradorCliente
            usuarioId={(sessao.user as any).id}
            nomeUsuario={`${sessao.user.name}`}
        />
    );
}