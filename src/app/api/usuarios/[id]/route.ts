import { exigirAdmin, exigirAdminOuProprioUsuario } from '@/lib/api-auth';
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

        // Permite leitura para administradores ou para o proprio comprador.
        const permissao = await exigirAdminOuProprioUsuario(id);
        if (!permissao.autorizado) return permissao.resposta;

        const usuario = await buscarComprador(id);

        if (!usuario) {
            return NextResponse.json(
                { erro: 'Usuario nao encontrado' },
                { status: 404 }
            );
        }

        return NextResponse.json(usuario);
    } catch (erro: unknown) {
        return NextResponse.json(
            { erro: erro instanceof Error ? erro.message : 'Erro interno.' },
            { status: 500 }
        );
    }
}

export async function PUT(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        // Edicao de comprador e uma acao administrativa.
        const permissao = await exigirAdmin();
        if (!permissao.autorizado) return permissao.resposta;

        const { id } = await params;
        const body = await req.json();
        const usuario = await alterarComprador(id, body);

        return NextResponse.json(usuario);
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
        // Remocao de comprador tambem fica restrita ao administrador.
        const permissao = await exigirAdmin();
        if (!permissao.autorizado) return permissao.resposta;

        const { id } = await params;
        await removerComprador(id);

        return NextResponse.json({ sucesso: true });
    } catch (erro: unknown) {
        return NextResponse.json(
            { erro: erro instanceof Error ? erro.message : 'Erro ao remover.' },
            { status: 500 }
        );
    }
}
