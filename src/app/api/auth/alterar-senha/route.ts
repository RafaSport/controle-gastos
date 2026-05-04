import { schemaAlterarSenha } from '@/schemas/usuario.schema';
import { alterarSenha } from '@/services/usuario.service';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { id, novaSenha } = body;

        // Valida a nova senha com o schema Zod
        schemaAlterarSenha.parse({ novaSenha });

        const usuario = await alterarSenha(id, novaSenha);
        return NextResponse.json({ sucesso: true, usuario });
    } catch (erro: any) {
        return NextResponse.json({ erro: erro.message }, { status: 400 });
    }
}
