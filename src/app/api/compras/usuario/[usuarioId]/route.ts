import { listarCompras } from '@/services/compra.service';
import { NextRequest, NextResponse } from 'next/server';

// Busca todas as compras de um usuário específico
export async function GET(
    _: NextRequest,
    { params }: { params: { usuarioId: string } }
) {
    try {
        const compras = await listarCompras(params.usuarioId);
        return NextResponse.json(compras);
    } catch (erro: any) {
        return NextResponse.json({ erro: erro.message }, { status: 500 });
    }
}
