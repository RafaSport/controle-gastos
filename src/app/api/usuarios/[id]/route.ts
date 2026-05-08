import {
    alterarComprador,
    buscarComprador,
    removerComprador,
} from '@/services/usuario.service';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(
    _: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const usuario = await buscarComprador(id);
        if (!usuario)
            return NextResponse.json(
                { erro: 'Usuário não encontrado' },
                { status: 404 }
            );
        return NextResponse.json(usuario);
    } catch (erro: any) {
        return NextResponse.json({ erro: erro.message }, { status: 500 });
    }
}

export async function PUT(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const body = await req.json();
        const usuario = await alterarComprador(id, body);
        return NextResponse.json(usuario);
    } catch (erro: any) {
        return NextResponse.json({ erro: erro.message }, { status: 400 });
    }
}

export async function DELETE(
    _: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        await removerComprador(id);
        return NextResponse.json({ sucesso: true });
    } catch (erro: any) {
        return NextResponse.json({ erro: erro.message }, { status: 500 });
    }
}
