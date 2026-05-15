import { schemaCadastroUsuario } from '@/schemas/usuario.schema';
import {
    buscarComprador,
    cadastrarComprador,
    listarCompradores,
} from '@/services/usuario.service';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url);
        const id = searchParams.get('id');

        // Busca usuário específico
        if (id) {
            const usuario = await buscarComprador(id);

            if (!usuario) {
                return NextResponse.json(
                    { erro: 'Usuário não encontrado' },
                    { status: 404 }
                );
            }

            return NextResponse.json(usuario);
        }

        // Lista todos os compradores
        const compradores = await listarCompradores();

        return NextResponse.json(compradores);
    } catch (erro: any) {
        console.error('ERRO NA API /api/usuarios -> GET');
        console.error(erro);

        return NextResponse.json(
            {
                erro: erro?.message ?? 'Erro interno no servidor',
            },
            { status: 500 }
        );
    }
}

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();

        const { nome, sobrenome, usaUber } = schemaCadastroUsuario.parse(body);

        const usuario = await cadastrarComprador(nome, sobrenome, usaUber);

        return NextResponse.json(usuario, { status: 201 });
    } catch (erro: any) {
        console.error('ERRO NA API /api/usuarios -> POST');
        console.error(erro);

        return NextResponse.json(
            {
                erro: erro?.message ?? 'Erro ao cadastrar usuário',
            },
            { status: 400 }
        );
    }
}