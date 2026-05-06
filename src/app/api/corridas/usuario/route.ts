import { listarCorridas } from '@/services/corrida.service';
import { NextRequest, NextResponse } from 'next/server';

// Recebe usuarioId, mes e ano via query string
export async function GET(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url);
        const usuarioId = searchParams.get('id') ?? '';
        const mes = parseInt(searchParams.get('mes') ?? '0');
        const ano = parseInt(searchParams.get('ano') ?? '0');

        if (!usuarioId || !mes || !ano) {
            return NextResponse.json(
                { erro: 'Parâmetros obrigatórios.' },
                { status: 400 }
            );
        }

        const corridas = await listarCorridas(usuarioId, mes, ano);
        return NextResponse.json(corridas);
    } catch (erro: any) {
        return NextResponse.json({ erro: erro.message }, { status: 500 });
    }
}