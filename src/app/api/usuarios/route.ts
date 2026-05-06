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

        // Se vier um ID busca usuário específico, senão lista todos
        if (id) {
            const usuario = await buscarComprador(id);
            if (!usuario)
                return NextResponse.json(
                    { erro: 'Usuário não encontrado' },
                    { status: 404 }
                );
            return NextResponse.json(usuario);
        }

        const compradores = await listarCompradores();
        return NextResponse.json(compradores);
    } catch (erro: any) {
        return NextResponse.json({ erro: erro.message }, { status: 500 });
    }
}

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { nome, sobrenome, usaUber } = schemaCadastroUsuario.parse(body);
        const usuario = await cadastrarComprador(nome, sobrenome, usaUber);
        return NextResponse.json(usuario, { status: 201 });
    } catch (erro: any) {
        return NextResponse.json({ erro: erro.message }, { status: 400 });
    }
}
