import { fecharMes, listarMesesFechados } from '@/services/mes.service';
import { NextRequest, NextResponse } from 'next/server';

// Busca os meses fechados de um usuário via query string
export async function GET(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url);
        const usuarioId = searchParams.get('id') ?? '';

        if (!usuarioId) {
            return NextResponse.json(
                { erro: 'ID obrigatório.' },
                { status: 400 }
            );
        }

        const meses = await listarMesesFechados(usuarioId);
        return NextResponse.json(meses);
    } catch (erro: any) {
        return NextResponse.json({ erro: erro.message }, { status: 500 });
    }
}

// Fecha o mês de um comprador registrando o que foi pago
export async function POST(req: NextRequest) {
    try {
        const { usuarioId, mes, ano, totalPago } = await req.json();
        const resultado = await fecharMes(usuarioId, mes, ano, totalPago);
        return NextResponse.json(resultado);
    } catch (erro: any) {
        return NextResponse.json({ erro: erro.message }, { status: 400 });
    }
}