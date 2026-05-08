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

    // Soma parcelas ativas no mês atual
    const totalCompras = compras
        .filter((c: any) => {
            const ini = c.anoInicio * 12 + c.mesInicio;
            const fim = c.anoFinal * 12 + c.mesFinal;
            const sel = ano * 12 + mes;
            return ini <= sel && fim >= sel;
        })
        .reduce((acc: number, c: any) => acc + c.valorParcela, 0);

    // Soma corridas do mês
    const corridas = await corridaRepo.buscarCorridasDoMes(usuarioId, mes, ano);
    const totalCorridas = corridas.reduce(
        (acc: number, c: any) => acc + c.valor,
        0
    );

    // Busca o último mês fechado antes deste para pegar a dívida rolante
    const mesesAnteriores = await mesRepo.buscarMesesFechados(usuarioId);
    const ultimoMes = mesesAnteriores
        .filter((mf: any) => mf.ano * 12 + mf.mes < ano * 12 + mes)
        .sort((a: any, b: any) => b.ano * 12 + b.mes - (a.ano * 12 + a.mes))[0];

    // Dívida anterior é apenas a dívida do último mês fechado
    // pois ela já estava embutida no totalDoMes daquele mês
    const dividaAnterior = ultimoMes
        ? Math.max(0, ultimoMes.totalDoMes - ultimoMes.totalPago)
        : 0;

    // Total do mês = compras + uber + dívida rolante do mês anterior
    const totalDoMes = totalCompras + totalCorridas + dividaAnterior;

    return await mesRepo.fecharMes({
        usuarioId,
        mes,
        ano,
        totalDoMes,
        totalPago,
        dividaAnterior,
    });
}