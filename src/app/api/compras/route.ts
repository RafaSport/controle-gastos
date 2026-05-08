import { schemaCadastroCompra } from '@/schemas/compra.schema';
import { cadastrarCompra } from '@/services/compra.service';
import { NextRequest, NextResponse } from 'next/server';

// Cadastra uma nova compra para um comprador
export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const dados = schemaCadastroCompra.parse(body);
        const compra = await cadastrarCompra(dados);
        return NextResponse.json(compra, { status: 201 });
    } catch (erro: any) {
        return NextResponse.json({ erro: erro.message }, { status: 400 });
    }
}
