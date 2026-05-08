import { prisma } from '@/lib/prisma';

// Busca todas as corridas de um usuário em um mês/ano específico
export async function buscarCorridasDoMes(
    usuarioId: string,
    mes: number,
    ano: number
) {
    const inicio = new Date(ano, mes - 1, 1); // primeiro dia do mês
    const fim = new Date(ano, mes, 0, 23, 59, 59); // último dia do mês

    return await (prisma as any).corrida.findMany({
        where: {
            usuarioId,
            data: { gte: inicio, lte: fim },
        },
        orderBy: { data: 'asc' },
    });
}

// Cria uma nova corrida
export async function criarCorrida(dados: {
    usuarioId: string;
    data: Date;
    valor: number;
}) {
    return await (prisma as any).corrida.create({ data: dados });
}

// Remove uma corrida
export async function deletarCorrida(id: string) {
    return await (prisma as any).corrida.delete({ where: { id } });
}
