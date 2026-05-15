import { exigirAdminOuProprioUsuario } from '@/lib/api-auth';
import { listarCompras } from '@/services/compra.service';
import { NextRequest, NextResponse } from 'next/server';

// Recebe o usuarioId via query string para evitar problema com IDs com pontos.
export async function GET(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url);
        const usuarioId = searchParams.get('id') ?? '';

        if (!usuarioId) {
            return NextResponse.json(
                { erro: 'ID obrigatorio.' },
                { status: 400 }
            );
        }

        // Compras so podem ser vistas pelo admin ou pelo comprador dono delas.
        const permissao = await exigirAdminOuProprioUsuario(usuarioId);
        if (!permissao.autorizado) return permissao.resposta;

        const compras = await listarCompras(usuarioId);

        return NextResponse.json(compras);
    } catch (erro: unknown) {
        return NextResponse.json(
            { erro: erro instanceof Error ? erro.message : 'Erro interno.' },
            { status: 500 }
        );
    }
}
