import { auth } from '@/lib/auth';
import { Papel } from '@/types';
import { NextResponse } from 'next/server';

type UsuarioSessaoApi = {
    id?: string;
    papel?: Papel;
};

type ResultadoAutorizacao =
    | {
          autorizado: true;
          usuario: UsuarioSessaoApi;
      }
    | {
          autorizado: false;
          resposta: NextResponse;
      };

function respostaNaoAutenticado() {
    return NextResponse.json(
        { erro: 'Usuario nao autenticado.' },
        { status: 401 }
    );
}

function respostaSemPermissao() {
    return NextResponse.json(
        { erro: 'Voce nao tem permissao para executar esta acao.' },
        { status: 403 }
    );
}

// Garante que a chamada veio de um usuario logado antes de liberar a API.
export async function exigirUsuarioAutenticado(): Promise<ResultadoAutorizacao> {
    const sessao = await auth();
    const usuario = sessao?.user as UsuarioSessaoApi | undefined;

    if (!sessao || !usuario?.id) {
        return {
            autorizado: false,
            resposta: respostaNaoAutenticado(),
        };
    }

    return {
        autorizado: true,
        usuario,
    };
}

// Garante que somente administradores executem a acao protegida.
export async function exigirAdmin(): Promise<ResultadoAutorizacao> {
    const resultado = await exigirUsuarioAutenticado();

    if (!resultado.autorizado) {
        return resultado;
    }

    if (resultado.usuario.papel !== 'ADMIN') {
        return {
            autorizado: false,
            resposta: respostaSemPermissao(),
        };
    }

    return resultado;
}

// Libera administradores ou o proprio comprador dono dos dados solicitados.
export async function exigirAdminOuProprioUsuario(
    usuarioId: string
): Promise<ResultadoAutorizacao> {
    const resultado = await exigirUsuarioAutenticado();

    if (!resultado.autorizado) {
        return resultado;
    }

    const ehAdmin = resultado.usuario.papel === 'ADMIN';
    const ehProprioUsuario = resultado.usuario.id === usuarioId;

    if (!ehAdmin && !ehProprioUsuario) {
        return {
            autorizado: false,
            resposta: respostaSemPermissao(),
        };
    }

    return resultado;
}
