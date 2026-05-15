import { exigirAdmin, exigirAdminOuProprioUsuario } from '@/lib/api-auth';
import { schemaAlterarSenha } from '@/schemas/usuario.schema';
import { alterarSenha, resetarSenha } from '@/services/usuario.service';
import { NextRequest, NextResponse } from 'next/server';

// Altera a senha no primeiro login ou em uma acao autorizada pelo proprio usuario.
export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { id, novaSenha } = body;

        if (!id) {
            return NextResponse.json(
                { erro: 'ID obrigatorio.' },
                { status: 400 }
            );
        }

        // O usuario so pode alterar a propria senha, exceto quando for admin.
        const permissao = await exigirAdminOuProprioUsuario(id);
        if (!permissao.autorizado) return permissao.resposta;

        schemaAlterarSenha.parse({ novaSenha });

        const usuario = await alterarSenha(id, novaSenha);

        return NextResponse.json({ sucesso: true, usuario });
    } catch (erro: unknown) {
        return NextResponse.json(
            {
                erro:
                    erro instanceof Error
                        ? erro.message
                        : 'Erro ao alterar senha.',
            },
            { status: 400 }
        );
    }
}

// Reseta a senha para o padrao (login123) e marca primeiroLogin: true.
export async function PATCH(req: NextRequest) {
    try {
        // Reset de senha e uma acao administrativa.
        const permissao = await exigirAdmin();
        if (!permissao.autorizado) return permissao.resposta;

        const { id } = await req.json();

        if (!id) {
            return NextResponse.json(
                { erro: 'ID obrigatorio.' },
                { status: 400 }
            );
        }

        await resetarSenha(id);

        return NextResponse.json({ sucesso: true });
    } catch (erro: unknown) {
        return NextResponse.json(
            {
                erro:
                    erro instanceof Error
                        ? erro.message
                        : 'Erro ao resetar senha.',
            },
            { status: 500 }
        );
    }
}
