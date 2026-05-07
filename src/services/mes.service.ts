import * as compraRepo from '@/repositories/compra.repository';
import * as corridaRepo from '@/repositories/corrida.repository';
import * as mesRepo from '@/repositories/mes.repository';

export async function listarMesesFechados(usuarioId: string) {
    return await mesRepo.buscarMesesFechados(usuarioId);
}

export async function fecharMes(
    usuarioId: string,
    mes: number,
    ano: number,
    totalPago: number
) {
    const compras = await compraRepo.buscarComprasPorUsuario(usuarioId);

    // Soma parcelas ativas no mês
    const totalCompras = compras
        .filter((c: any) => {
            const ini = c.anoInicio * 12 + c.mesInicio;
            const fim = c.anoFinal * 12 + c.mesFinal;
            const sel = ano * 12 + mes;
            return ini <= sel && fim >= sel;
        })
        .reduce((acc: number, c: any) => acc + c.valorParcela, 0);

    // Soma corridas do mês se houver
    const corridas = await corridaRepo.buscarCorridasDoMes(usuarioId, mes, ano);
    const totalCorridas = corridas.reduce(
        (acc: number, c: any) => acc + c.valor,
        0
    );

    // Busca dívida acumulada de meses anteriores
    const mesesAnteriores = await mesRepo.buscarMesesFechados(usuarioId);
    const dividaAnterior = mesesAnteriores
        .filter((mf: any) => mf.ano * 12 + mf.mes < ano * 12 + mes)
        .reduce(
            (acc: number, mf: any) => acc + (mf.totalDoMes - mf.totalPago),
            0
        );

    const totalDoMes =
        totalCompras + totalCorridas + Math.max(0, dividaAnterior);

    // Diferença negativa significa que pagou mais do que devia
    return await mesRepo.fecharMes({
        usuarioId,
        mes,
        ano,
        totalDoMes,
        totalPago,
        dividaAnterior: Math.max(0, dividaAnterior),
    });
}