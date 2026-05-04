import { fecharMes } from '@/services/mes.service';
import { NextRequest, NextResponse } from 'next/server';

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
