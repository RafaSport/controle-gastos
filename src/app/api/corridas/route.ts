import { exigirAdmin } from '@/lib/api-auth';
import { cadastrarCorrida } from '@/services/corrida.service';
import { NextRequest, NextResponse } from 'next/server';

// Cadastra uma nova corrida de Uber.
export async function POST(req: NextRequest) {
    try {
        // O registro de corridas e feito pelo administrador no fluxo atual.
        const permissao = await exigirAdmin();
        if (!permissao.autorizado) return permissao.resposta;

        const body = await req.json();
        const corrida = await cadastrarCorrida(body);

        return NextResponse.json(corrida, { status: 201 });
    } catch (erro: unknown) {
        return NextResponse.json(
            {
                erro:
                    erro instanceof Error
                        ? erro.message
                        : 'Erro ao cadastrar corrida.',
            },
            { status: 400 }
        );
    }
}
