import { schemaCadastroUsuario } from '@/schemas/usuario.schema';
import {
    cadastrarComprador,
    listarCompradores,
} from '@/services/usuario.service';
import { NextRequest, NextResponse } from 'next/server';

// Lista todos os compradores — acessado pela tela inicial do admin
export async function GET() {
    try {
        const compradores = await listarCompradores();
        return NextResponse.json(compradores);
    } catch (erro: any) {
        return NextResponse.json({ erro: erro.message }, { status: 500 });
    }
}

// Cadastra um novo comprador com login e senha gerados automaticamente
export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { nome, sobrenome } = schemaCadastroUsuario.parse(body);
        const usuario = await cadastrarComprador(nome, sobrenome);
        return NextResponse.json(usuario, { status: 201 });
    } catch (erro: any) {
        return NextResponse.json({ erro: erro.message }, { status: 400 });
    }
}
