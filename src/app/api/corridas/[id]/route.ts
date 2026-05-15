import { exigirAdmin } from '@/lib/api-auth';
import { removerCorrida } from '@/services/corrida.service';
import { NextRequest, NextResponse } from 'next/server';

export async function DELETE(
    _: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        // Remocao de corridas fica restrita ao administrador.
        const permissao = await exigirAdmin();
        if (!permissao.autorizado) return permissao.resposta;

        const { id } = await params;
        await removerCorrida(id);

        return NextResponse.json({ sucesso: true });
    } catch (erro: unknown) {
        return NextResponse.json(
            { erro: erro instanceof Error ? erro.message : 'Erro ao remover.' },
            { status: 500 }
        );
    }
}
