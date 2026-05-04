import { Cartao, Compra } from '@/types';
import CartaoTag from './CartaoTag';

interface TabelaComprasProps {
    compras: Compra[];
    mesSelecionado: number;
    anoSelecionado: number;
}

const MESES = [
    'Jan',
    'Fev',
    'Mar',
    'Abr',
    'Mai',
    'Jun',
    'Jul',
    'Ago',
    'Set',
    'Out',
    'Nov',
    'Dez',
];

function ordenarCompras(compras: Compra[], mes: number, ano: number): Compra[] {
    const contagemPorCartao: Record<string, number> = {};
    compras.forEach((c) => {
        const ini = c.anoInicio * 12 + c.mesInicio;
        const fim = c.anoFinal * 12 + c.mesFinal;
        const sel = ano * 12 + mes;
        if (ini <= sel && fim >= sel) {
            contagemPorCartao[c.cartao] =
                (contagemPorCartao[c.cartao] || 0) + 1;
        }
    });

    return [...compras].sort((a, b) => {
        const contA = contagemPorCartao[a.cartao] || 0;
        const contB = contagemPorCartao[b.cartao] || 0;
        if (contA !== contB) return contA - contB;

        if (a.cartao === b.cartao) {
            return (
                a.anoFinal * 12 + a.mesFinal - (b.anoFinal * 12 + b.mesFinal)
            );
        }
        return a.cartao.localeCompare(b.cartao);
    });
}

export default function TabelaCompras({
    compras,
    mesSelecionado,
    anoSelecionado,
}: TabelaComprasProps) {
    const comprasDoMes = compras.filter((c) => {
        const ini = c.anoInicio * 12 + c.mesInicio;
        const fim = c.anoFinal * 12 + c.mesFinal;
        const sel = anoSelecionado * 12 + mesSelecionado;
        return ini <= sel && fim >= sel;
    });

    const ordenadas = ordenarCompras(
        comprasDoMes,
        mesSelecionado,
        anoSelecionado
    );

    if (ordenadas.length === 0) {
        return (
            <div className="text-center py-12 text-zinc-500 text-sm">
                Nenhuma compra neste mês.
            </div>
        );
    }

    return (
        <div className="w-full overflow-x-auto rounded-lg border border-zinc-800">
            <table className="w-full text-sm min-w-[640px]">
                <thead>
                    <tr className="bg-zinc-800 text-zinc-400 text-xs uppercase tracking-wide">
                        <th className="px-3 py-3 text-left">Cartão</th>
                        <th className="px-3 py-3 text-left">Descrição</th>
                        <th className="px-3 py-3 text-center">Mês compra</th>
                        <th className="px-3 py-3 text-center">Início</th>
                        <th className="px-3 py-3 text-center">Parcelas</th>
                        <th className="px-3 py-3 text-center">Término</th>
                        <th className="px-3 py-3 text-right">Valor</th>
                    </tr>
                </thead>
                <tbody>
                    {ordenadas.map((compra, index) => (
                        <tr
                            key={compra.id}
                            // Zebrado: linha par mais escura, ímpar mais clara
                            className={
                                index % 2 === 0 ? 'bg-zinc-900' : 'bg-zinc-800'
                            }
                        >
                            {/* Primeira coluna com cor de fundo do cartão */}
                            <td className="px-2 py-2">
                                <CartaoTag cartao={compra.cartao as Cartao} />
                            </td>
                            <td className="px-2 py-2 text-zinc-200">
                                {compra.descricao}
                            </td>
                            <td className="px-2 py-2 text-center text-zinc-400">
                                {MESES[compra.mesCompra - 1]}/{compra.anoCompra}
                            </td>
                            <td className="px-2 py-2 text-center text-zinc-400">
                                {MESES[compra.mesInicio - 1]}/{compra.anoInicio}
                            </td>
                            <td className="px-2 py-2 text-center text-zinc-400">
                                {anoSelecionado * 12 +
                                    mesSelecionado -
                                    (compra.anoInicio * 12 + compra.mesInicio) +
                                    1}
                                /{compra.qtdParcelas}
                            </td>
                            <td className="px-2 py-2 text-center text-zinc-400">
                                {MESES[compra.mesFinal - 1]}/{compra.anoFinal}
                            </td>
                            <td className="px-2 py-2 text-right font-medium text-zinc-100">
                                R${' '}
                                {compra.valorParcela
                                    .toFixed(2)
                                    .replace('.', ',')}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
