// Gera o login automático a partir do nome e sobrenome
// Exemplo: "Ana Bia" → "ana.bia"
export function gerarLogin(nome: string, sobrenome: string): string {
    const nomeLimpo = nome
        .trim()
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '');
    const sobrenomeLimpo = sobrenome
        .trim()
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '');
    return `${nomeLimpo}.${sobrenomeLimpo}`;
}

// Sufixo padrão para senhas geradas automaticamente
// Pode ser sobrescrito via variável de ambiente SENHA_PADRAO_SUFFIX
const SENHA_PADRAO_SUFFIX = process.env.SENHA_PADRAO_SUFFIX ?? '123';

// Gera a senha padrão a partir do login
// Exemplo: "ana.bia" → "ana.bia123"
export function gerarSenhaPadrao(login: string): string {
    return `${login}${SENHA_PADRAO_SUFFIX}`;
}

// Calcula o mês e ano final de uma compra parcelada
// Exemplo: inicio maio/2025, 3 parcelas → final julho/2025
export function calcularMesFinal(
    mesInicio: number,
    anoInicio: number,
    qtdParcelas: number
): { mesFinal: number; anoFinal: number } {
    const totalMeses = mesInicio + qtdParcelas - 1;
    const mesFinal = ((totalMeses - 1) % 12) + 1;
    const anoFinal = anoInicio + Math.floor((totalMeses - 1) / 12);
    return { mesFinal, anoFinal };
}

/**
 * Converte mês e ano para um índice numérico único.
 * Útil para comparações e ordenações cronológicas.
 * Exemplo: mes=5, ano=2026 → 24317
 */
export function paraIndiceMes(mes: number, ano: number): number {
    return ano * 12 + mes;
}

/**
 * Verifica se uma compra está ativa em determinado mês/ano.
 * Uma compra está ativa quando o mês selecionado está entre
 * o mês de início e o mês final da compra.
 */
export function compraEstaAtivaNoMes(
    compra: {
        mesInicio: number;
        anoInicio: number;
        mesFinal: number;
        anoFinal: number;
    },
    mes: number,
    ano: number
): boolean {
    const inicio = paraIndiceMes(compra.mesInicio, compra.anoInicio);
    const fim = paraIndiceMes(compra.mesFinal, compra.anoFinal);
    const selecionado = paraIndiceMes(mes, ano);
    return inicio <= selecionado && fim >= selecionado;
}

/**
 * Calcula o total de compras ativas em determinado mês/ano.
 * Soma o valorParcela de todas as compras que estão ativas no período.
 */
export function calcularTotalComprasNoMes(
    compras: {
        mesInicio: number;
        anoInicio: number;
        mesFinal: number;
        anoFinal: number;
        valorParcela: number;
    }[],
    mes: number,
    ano: number
): number {
    return compras
        .filter((c) => compraEstaAtivaNoMes(c, mes, ano))
        .reduce((acc, c) => acc + c.valorParcela, 0);
}

/**
 * Encontra o último mês fechado anterior a determinado mês/ano.
 * Retorna o MesFechado mais recente antes do período informado.
 */
export function buscarUltimoMesFechado(
    mesesFechados: {
        mes: number;
        ano: number;
        totalDoMes: number;
        totalPago: number;
    }[],
    mes: number,
    ano: number
): { mes: number; ano: number; totalDoMes: number; totalPago: number } | null {
    const indiceAtual = paraIndiceMes(mes, ano);

    const anteriores = mesesFechados.filter(
        (mf) => paraIndiceMes(mf.mes, mf.ano) < indiceAtual
    );

    if (anteriores.length === 0) return null;

    // Ordena do mais recente para o mais antigo e pega o primeiro
    return anteriores.sort(
        (a, b) => paraIndiceMes(b.mes, b.ano) - paraIndiceMes(a.mes, a.ano)
    )[0];
}

/**
 * Calcula a dívida anterior (rolante) com base no último mês fechado.
 * Dívida = totalDoMes - totalPago (nunca negativa)
 */
export function calcularDividaAnterior(
    mesesFechados: {
        mes: number;
        ano: number;
        totalDoMes: number;
        totalPago: number;
    }[],
    mes: number,
    ano: number
): number {
    const ultimo = buscarUltimoMesFechado(mesesFechados, mes, ano);
    if (!ultimo) return 0;
    return Math.max(0, ultimo.totalDoMes - ultimo.totalPago);
}

/**
 * Calcula o total consolidado do mês.
 * Total = Compras + Uber + Dívida Anterior
 */
export function calcularTotalConsolidado(
    totalCompras: number,
    totalUber: number,
    dividaAnterior: number
): number {
    return totalCompras + totalUber + dividaAnterior;
}

/**
 * Encontra o primeiro mês em aberto (não fechado) a partir de hoje.
 * Percorre os meses a partir do mês/ano atual até encontrar um não fechado.
 */
export function encontrarPrimeiroMesEmAberto(
    mesesFechados: { mes: number; ano: number }[],
    mesAtual: number,
    anoAtual: number
): { mes: number; ano: number } {
    let m = mesAtual;
    let a = anoAtual;

    while (mesesFechados.some((mf) => mf.mes === m && mf.ano === a)) {
        m = m === 12 ? 1 : m + 1;
        if (m === 1) a++;
    }

    return { mes: m, ano: a };
}

/**
 * Gera a lista de meses disponíveis para o seletor.
 * Inclui 2 meses de histórico e 10 meses à frente do mês em aberto.
 */
export function gerarMesesDisponiveis(
    mesesFechados: { mes: number; ano: number }[],
    mesEmAberto: number,
    anoEmAberto: number
): { mes: number; ano: number; fechado: boolean }[] {
    const lista = [];

    for (let i = -2; i <= 10; i++) {
        const data = new Date(anoEmAberto, mesEmAberto - 1 + i, 1);
        const m = data.getMonth() + 1;
        const a = data.getFullYear();
        const fechado = mesesFechados.some(
            (mf) => mf.mes === m && mf.ano === a
        );

        lista.push({ mes: m, ano: a, fechado });
    }

    return lista;
}
