import { cadastrarCorrida } from '@/services/corrida.service';
import { NextRequest, NextResponse } from 'next/server';

// Cadastra uma nova corrida de uber
export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const corrida = await cadastrarCorrida(body);
        return NextResponse.json(corrida, { status: 201 });
    } catch (erro: any) {
        return NextResponse.json({ erro: erro.message }, { status: 400 });
    }
}
