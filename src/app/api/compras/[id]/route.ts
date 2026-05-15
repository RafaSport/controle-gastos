import { exigirAdmin } from '@/lib/api-auth';
import { editarCompra, removerCompra } from '@/services/compra.service';
import { NextRequest, NextResponse } from 'next/server';

export async function PUT(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        // Edicao de compra fica restrita ao administrador do sistema.
        const permissao = await exigirAdmin();
        if (!permissao.autorizado) return permissao.resposta;

        const { id } = await params;
        const body = await req.json();
        const compra = await editarCompra(id, body);

        return NextResponse.json(compra);
    } catch (erro: unknown) {
        return NextResponse.json(
            { erro: erro instanceof Error ? erro.message : 'Erro ao editar.' },
            { status: 400 }
        );
    }
}

export async function DELETE(
    _: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        // Exclusao de compra tambem e uma operacao administrativa.
        const permissao = await exigirAdmin();
        if (!permissao.autorizado) return permissao.resposta;

        const { id } = await params;
        await removerCompra(id);

        return NextResponse.json({ sucesso: true });
    } catch (erro: unknown) {
        return NextResponse.json(
            { erro: erro instanceof Error ? erro.message : 'Erro ao remover.' },
            { status: 500 }
        );
    }
}
