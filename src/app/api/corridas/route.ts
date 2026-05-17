import { exigirAdmin } from '@/lib/api-auth';
import { schemaCadastroCorrida } from '@/schemas/corrida.schema';
import { cadastrarCorrida } from '@/services/corrida.service';
import { NextRequest, NextResponse } from 'next/server';

// Cadastra uma nova corrida de Uber.
export async function POST(req: NextRequest) {
    try {
        // O registro de corridas é feito pelo administrador no fluxo atual.
        const permissao = await exigirAdmin();
        if (!permissao.autorizado) return permissao.resposta;

        const body = await req.json();

        // Valida os dados de entrada com Zod antes de processar
        const dadosValidados = schemaCadastroCorrida.parse(body);

        const corrida = await cadastrarCorrida(dadosValidados);

        return NextResponse.json(corrida, { status: 201 });
    } catch (erro: unknown) {
        // Erro de validação Zod
        if (erro instanceof Error && erro.name === 'ZodError') {
            return NextResponse.json(
                {
                    erro:
                        'Dados inválidos: ' + (erro as any).issues[0]?.message,
                },
                { status: 400 }
            );
        }

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