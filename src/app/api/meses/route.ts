import { exigirAdmin, exigirAdminOuProprioUsuario } from '@/lib/api-auth';
import { fecharMes, listarMesesFechados } from '@/services/mes.service';
import { NextRequest, NextResponse } from 'next/server';

// Busca os meses fechados de um usuario via query string.
export async function GET(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url);
        const usuarioId = searchParams.get('id') ?? '';

        if (!usuarioId) {
            return NextResponse.json(
                { erro: 'ID obrigatorio.' },
                { status: 400 }
            );
        }

        // Historico mensal pode ser visto pelo admin ou pelo proprio comprador.
        const permissao = await exigirAdminOuProprioUsuario(usuarioId);
        if (!permissao.autorizado) return permissao.resposta;

        const meses = await listarMesesFechados(usuarioId);

        return NextResponse.json(meses);
    } catch (erro: unknown) {
        return NextResponse.json(
            { erro: erro instanceof Error ? erro.message : 'Erro interno.' },
            { status: 500 }
        );
    }
}

// Fecha o mes de um comprador registrando o que foi pago.
export async function POST(req: NextRequest) {
    try {
        // No fluxo atual, apenas o admin registra pagamentos/fechamento de mes.
        const permissao = await exigirAdmin();
        if (!permissao.autorizado) return permissao.resposta;

        const { usuarioId, mes, ano, totalPago } = await req.json();
        const resultado = await fecharMes(usuarioId, mes, ano, totalPago);

        return NextResponse.json(resultado);
    } catch (erro: unknown) {
        return NextResponse.json(
            {
                erro:
                    erro instanceof Error
                        ? erro.message
                        : 'Erro ao fechar o mes.',
            },
            { status: 400 }
        );
    }
}
