import { exigirAdmin } from '@/lib/api-auth';
import { schemaCadastroCompra } from '@/schemas/compra.schema';
import { cadastrarCompra } from '@/services/compra.service';
import { NextRequest, NextResponse } from 'next/server';

// Cadastra uma nova compra para um comprador.
export async function POST(req: NextRequest) {
    try {
        // No fluxo atual, somente o admin registra compras para compradores.
        const permissao = await exigirAdmin();
        if (!permissao.autorizado) return permissao.resposta;

        const body = await req.json();
        const dados = schemaCadastroCompra.parse(body);
        const compra = await cadastrarCompra(dados);

        return NextResponse.json(compra, { status: 201 });
    } catch (erro: unknown) {
        return NextResponse.json(
            {
                erro:
                    erro instanceof Error
                        ? erro.message
                        : 'Erro ao cadastrar compra.',
            },
            { status: 400 }
        );
    }
}
