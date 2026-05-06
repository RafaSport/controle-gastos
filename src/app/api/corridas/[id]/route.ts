import { removerCorrida } from '@/services/corrida.service';
import { NextRequest, NextResponse } from 'next/server';

export async function DELETE(
    _: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        await removerCorrida(id);
        return NextResponse.json({ sucesso: true });
    } catch (erro: any) {
        return NextResponse.json({ erro: erro.message }, { status: 500 });
    }
}