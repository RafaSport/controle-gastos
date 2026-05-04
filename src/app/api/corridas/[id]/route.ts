import { removerCorrida } from '@/services/corrida.service';
import { NextRequest, NextResponse } from 'next/server';

// Remove uma corrida pelo ID
export async function DELETE(
    _: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        await removerCorrida(params.id);
        return NextResponse.json({ sucesso: true });
    } catch (erro: any) {
        return NextResponse.json({ erro: erro.message }, { status: 500 });
    }
}
