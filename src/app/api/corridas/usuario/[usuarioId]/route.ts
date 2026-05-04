import { listarCorridas } from '@/services/corrida.service';
import { NextRequest, NextResponse } from 'next/server';

// Busca corridas de um usuário em um mês/ano
export async function GET(
    req: NextRequest,
    { params }: { params: { usuarioId: string } }
) {
    try {
        // Pega mês e ano da query string — ex: ?mes=5&ano=2025
        const { searchParams } = new URL(req.url);
        const mes = parseInt(searchParams.get('mes') ?? '0');
        const ano = parseInt(searchParams.get('ano') ?? '0');

        if (!mes || !ano) {
            return NextResponse.json(
                { erro: 'Mês e ano obrigatórios.' },
                { status: 400 }
            );
        }

        const corridas = await listarCorridas(params.usuarioId, mes, ano);
        return NextResponse.json(corridas);
    } catch (erro: any) {
        return NextResponse.json({ erro: erro.message }, { status: 500 });
    }
}
