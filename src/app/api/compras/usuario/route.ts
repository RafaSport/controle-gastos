import { listarCompras } from '@/services/compra.service';
import { NextRequest, NextResponse } from 'next/server';

// Recebe o usuarioId via query string para evitar problema com IDs com pontos
export async function GET(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url);
        const usuarioId = searchParams.get('id') ?? '';

        if (!usuarioId) {
            return NextResponse.json(
                { erro: 'ID obrigatório.' },
                { status: 400 }
            );
        }

        const compras = await listarCompras(usuarioId);
        return NextResponse.json(compras);
    } catch (erro: any) {
        return NextResponse.json({ erro: erro.message }, { status: 500 });
    }
}
