import { exigirAdminOuProprioUsuario } from '@/lib/api-auth';
import { listarCorridas } from '@/services/corrida.service';
import { NextRequest, NextResponse } from 'next/server';

// Recebe usuarioId, mes e ano via query string.
export async function GET(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url);
        const usuarioId = searchParams.get('id') ?? '';
        const mes = parseInt(searchParams.get('mes') ?? '0');
        const ano = parseInt(searchParams.get('ano') ?? '0');

        if (!usuarioId || !mes || !ano) {
            return NextResponse.json(
                { erro: 'Parametros obrigatorios.' },
                { status: 400 }
            );
        }

        // Corridas so podem ser vistas pelo admin ou pelo comprador dono delas.
        const permissao = await exigirAdminOuProprioUsuario(usuarioId);
        if (!permissao.autorizado) return permissao.resposta;

        const corridas = await listarCorridas(usuarioId, mes, ano);

        return NextResponse.json(corridas);
    } catch (erro: unknown) {
        return NextResponse.json(
            { erro: erro instanceof Error ? erro.message : 'Erro interno.' },
            { status: 500 }
        );
    }
}
