import { prisma } from '@/lib/prisma';

// Busca todas as compras de um usuário
export async function buscarComprasPorUsuario(usuarioId: string) {
    return await (prisma as any).compra.findMany({
        where: { usuarioId },
        orderBy: { criadoEm: 'asc' },
    });
}

// Cria uma nova compra com mês final já calculado
export async function criarCompra(dados: {
    usuarioId: string;
    cartao: string;
    descricao: string;
    mesCompra: number;
    anoCompra: number;
    mesInicio: number;
    anoInicio: number;
    qtdParcelas: number;
    mesFinal: number;
    anoFinal: number;
    valorParcela: number;
}) {
    return await (prisma as any).compra.create({ data: dados });
}

// Atualiza os dados de uma compra existente
export async function atualizarCompra(
    id: string,
    dados: Partial<{
        cartao: string;
        descricao: string;
        mesCompra: number;
        anoCompra: number;
        mesInicio: number;
        anoInicio: number;
        qtdParcelas: number;
        mesFinal: number;
        anoFinal: number;
        valorParcela: number;
    }>
) {
    return await (prisma as any).compra.update({ where: { id }, data: dados });
}

// Remove uma compra pelo ID
export async function deletarCompra(id: string) {
    return await (prisma as any).compra.delete({ where: { id } });
}