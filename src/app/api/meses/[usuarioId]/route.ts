import { listarMesesFechados } from '@/services/mes.service';
import { NextRequest, NextResponse } from 'next/server';

// Retorna todos os meses fechados de um usuário
export async function GET(
    _: NextRequest,
    { params }: { params: { usuarioId: string } }
) {
    try {
        const meses = await listarMesesFechados(params.usuarioId);
        return NextResponse.json(meses);
    } catch (erro: any) {
        return NextResponse.json({ erro: erro.message }, { status: 500 });
    }
}
