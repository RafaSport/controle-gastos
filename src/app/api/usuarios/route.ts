import { exigirAdmin, exigirAdminOuProprioUsuario } from '@/lib/api-auth';
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

        // Busca um usuario especifico somente para admin ou para o proprio dono dos dados.
        if (id) {
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
        }

        // A listagem completa de compradores e uma operacao administrativa.
        const permissao = await exigirAdmin();
        if (!permissao.autorizado) return permissao.resposta;

        const compradores = await listarCompradores();

        return NextResponse.json(compradores);
    } catch (erro: unknown) {
        console.error('ERRO NA API /api/usuarios -> GET');
        console.error(erro);

        return NextResponse.json(
            {
                erro:
                    erro instanceof Error
                        ? erro.message
                        : 'Erro interno no servidor',
            },
            { status: 500 }
        );
    }
}

export async function POST(req: NextRequest) {
    try {
        // Apenas administradores podem cadastrar novos compradores.
        const permissao = await exigirAdmin();
        if (!permissao.autorizado) return permissao.resposta;

        const body = await req.json();
        const { nome, sobrenome, usaUber } = schemaCadastroUsuario.parse(body);
        const usuario = await cadastrarComprador(nome, sobrenome, usaUber);

        return NextResponse.json(usuario, { status: 201 });
    } catch (erro: unknown) {
        console.error('ERRO NA API /api/usuarios -> POST');
        console.error(erro);

        return NextResponse.json(
            {
                erro:
                    erro instanceof Error
                        ? erro.message
                        : 'Erro ao cadastrar usuario',
            },
            { status: 400 }
        );
    }
}
