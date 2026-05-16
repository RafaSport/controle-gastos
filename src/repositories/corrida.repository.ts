import { prisma } from '@/lib/prisma';

// Busca todas as corridas cobradas em um mes/ano financeiro especifico.
export async function buscarCorridasDoMes(
    usuarioId: string,
    mes: number,
    ano: number
) {
    return await prisma.corrida.findMany({
        where: {
            usuarioId,
            mesReferencia: mes,
            anoReferencia: ano,
        },
        orderBy: { data: 'asc' },
    });
}

// Cria uma nova corrida com data real e mes financeiro de cobranca separados.
export async function criarCorrida(dados: {
    usuarioId: string;
    data: Date;
    mesReferencia: number;
    anoReferencia: number;
    valor: number;
}) {
    return await prisma.corrida.create({ data: dados });
}

// Remove uma corrida.
export async function deletarCorrida(id: string) {
    return await prisma.corrida.delete({ where: { id } });
}
