import { editarCompra, removerCompra } from '@/services/compra.service';
import { NextRequest, NextResponse } from 'next/server';

// Edita uma compra existente
export async function PUT(
    req: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const body = await req.json();
        const compra = await editarCompra(params.id, body);
        return NextResponse.json(compra);
    } catch (erro: any) {
        return NextResponse.json({ erro: erro.message }, { status: 400 });
    }
}

// Remove uma compra pelo ID
export async function DELETE(
    _: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        await removerCompra(params.id);
        return NextResponse.json({ sucesso: true });
    } catch (erro: any) {
        return NextResponse.json({ erro: erro.message }, { status: 500 });
    }
}
