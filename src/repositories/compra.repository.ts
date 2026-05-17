import { Compra, Prisma } from '@/generated/prisma/client';
import { prisma } from '@/lib/prisma';

// Busca todas as compras de um usuário
export async function buscarComprasPorUsuario(
    usuarioId: string
): Promise<Compra[]> {
    return await prisma.compra.findMany({
        where: { usuarioId },
        orderBy: { criadoEm: 'asc' },
    });
}

// Cria uma nova compra com mês final já calculado
export async function criarCompra(
    dados: Prisma.CompraCreateInput
): Promise<Compra> {
    return await prisma.compra.create({ data: dados });
}

// Atualiza os dados de uma compra existente
export async function atualizarCompra(
    id: string,
    dados: Prisma.CompraUpdateInput
): Promise<Compra> {
    return await prisma.compra.update({ where: { id }, data: dados });
}

// Remove uma compra pelo ID
export async function deletarCompra(id: string): Promise<Compra> {
    return await prisma.compra.delete({ where: { id } });
}