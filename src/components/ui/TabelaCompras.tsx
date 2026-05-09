import { Cartao, Compra } from '@/types';
import CartaoTag from './CartaoTag';
import TabelaBase, { Coluna } from '../base/TabelaBase';

// Props específicas da tabela de compras
interface TabelaComprasProps {
    compras: Compra[];
    mesSelecionado: number;
    anoSelecionado: number;
    // Prop opcional — se passada, renderiza coluna de ações (visão admin)
    acoes?: (compra: Compra) => React.ReactNode;
}

// Array de meses para exibição
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

// Função para ordenar compras conforme regras de negócio
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
    acoes,
}: TabelaComprasProps) {
    // Filtra compras do mês selecionado
    const comprasDoMes = compras.filter((c) => {
        const ini = c.anoInicio * 12 + c.mesInicio;
        const fim = c.anoFinal * 12 + c.mesFinal;
        const sel = anoSelecionado * 12 + mesSelecionado;
        return ini <= sel && fim >= sel;
    });

    // Ordena conforme regras
    const ordenadas = ordenarCompras(
        comprasDoMes,
        mesSelecionado,
        anoSelecionado
    );

    // Define colunas da tabela
    const colunas: Coluna<Compra>[] = [
        {
            header: 'Cartão',
            render: (compra) => <CartaoTag cartao={compra.cartao as Cartao} />,
        },
        {
            header: 'Descrição',
            render: (compra) => compra.descricao,
        },
        {
            header: 'Mês compra',
            render: (compra) =>
                `${MESES[compra.mesCompra - 1]}/${compra.anoCompra}`,
            align: 'center',
        },
        {
            header: 'Início',
            render: (compra) =>
                `${MESES[compra.mesInicio - 1]}/${compra.anoInicio}`,
            align: 'center',
        },
        {
            header: 'Parcelas',
            render: (compra) =>
                `${anoSelecionado * 12 + mesSelecionado - (compra.anoInicio * 12 + compra.mesInicio) + 1}/${compra.qtdParcelas}`,
            align: 'center',
        },
        {
            header: 'Término',
            render: (compra) =>
                `${MESES[compra.mesFinal - 1]}/${compra.anoFinal}`,
            align: 'center',
        },
        {
            header: 'Valor',
            render: (compra) =>
                `R$ ${compra.valorParcela.toFixed(2).replace('.', ',')}`,
            align: 'right',
        },
    ];

    return (
        <TabelaBase
            dados={ordenadas}
            colunas={colunas}
            acoes={acoes}
            emptyMessage="Nenhuma compra neste mês."
        />
    );
}
