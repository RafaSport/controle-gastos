import { schemaAlterarSenha } from '@/schemas/usuario.schema';
import { alterarSenha, resetarSenha } from '@/services/usuario.service';
import { NextRequest, NextResponse } from 'next/server';

// Altera a senha no primeiro login
export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { id, novaSenha } = body;
        schemaAlterarSenha.parse({ novaSenha });
        const usuario = await alterarSenha(id, novaSenha);
        return NextResponse.json({ sucesso: true, usuario });
    } catch (erro: any) {
        return NextResponse.json({ erro: erro.message }, { status: 400 });
    }
}

// Reseta a senha para o padrão (login123) e marca primeiroLogin: true
export async function PATCH(req: NextRequest) {
    try {
        const { id } = await req.json();
        if (!id)
            return NextResponse.json(
                { erro: 'ID obrigatório.' },
                { status: 400 }
            );
        await resetarSenha(id);
        return NextResponse.json({ sucesso: true });
    } catch (erro: any) {
        return NextResponse.json({ erro: erro.message }, { status: 500 });
    }
}
