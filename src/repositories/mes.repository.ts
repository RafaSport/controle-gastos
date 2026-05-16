import { prisma } from '@/lib/prisma';

export async function buscarMesesFechados(usuarioId: string) {
    return await prisma.mesFechado.findMany({
        where: { usuarioId },
        orderBy: [{ ano: 'asc' }, { mes: 'asc' }],
    });
}

export async function fecharMes(dados: {
    usuarioId: string;
    mes: number;
    ano: number;
    totalDoMes: number;
    totalPago: number;
    dividaAnterior: number;
}) {
    return await prisma.mesFechado.upsert({
        where: {
            usuarioId_mes_ano: {
                usuarioId: dados.usuarioId,
                mes: dados.mes,
                ano: dados.ano,
            },
        },
        update: {
            totalDoMes: dados.totalDoMes,
            totalPago: dados.totalPago,
            dividaAnterior: dados.dividaAnterior,
        },
        create: dados,
    });
}
