import { calcularParcelaAtual } from '@/lib/utils';
import { Compra } from '@/types';
import { useState } from 'react';
import TabelaBase, { Coluna } from '../base/TabelaBase';
import CartaoTag from './CartaoTag';
import ModalDetalhesCompra from './ModalDetalhesCompra';

// Props específicas da tabela de compras
interface TabelaComprasProps {
    compras: Compra[];
    mesSelecionado: number;
    anoSelecionado: number;
    // Ações opcionais — se passadas, aparecem no modal de detalhes (admin)
    onEditar?: (compra: Compra) => void;
    onExcluir?: (compra: Compra) => void;
}

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
    onEditar,
    onExcluir,
}: TabelaComprasProps) {
    const [compraSelecionada, setCompraSelecionada] = useState<Compra | null>(
        null
    );
    const [modalAberto, setModalAberto] = useState(false);

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

    // Abre modal com detalhes da compra
    function handleRowClick(compra: Compra) {
        setCompraSelecionada(compra);
        setModalAberto(true);
    }

    function handleFecharModal() {
        setModalAberto(false);
        setCompraSelecionada(null);
    }

    // Define colunas da tabela — SIMPLIFICADA: apenas 4 colunas
    // CORREÇÃO: fontes menores no mobile, descrição truncada
    const colunas: Coluna<Compra>[] = [
        {
            header: 'Cartão',
            render: (compra) => (
                <div className="scale-90 sm:scale-100 origin-left">
                    <CartaoTag cartao={compra.cartao} />
                </div>
            ),
        },
        {
            header: 'Descrição',
            render: (compra) => (
                <span className="text-zinc-200 text-xs sm:text-sm truncate max-w-20 sm:max-w-36 md:max-w-none block">
                    {compra.descricao}
                </span>
            ),
        },
        {
            header: 'Parcelas',
            align: 'center',
            render: (compra) => {
                const parcelaAtual = calcularParcelaAtual(
                    compra.mesInicio,
                    compra.anoInicio,
                    compra.qtdParcelas,
                    mesSelecionado,
                    anoSelecionado
                );
                return (
                    <span className="text-zinc-400 text-xs sm:text-sm whitespace-nowrap">
                        {parcelaAtual}/{compra.qtdParcelas}
                    </span>
                );
            },
        },
        {
            header: 'Valor',
            align: 'right',
            render: (compra) => (
                <span className="text-zinc-100 font-medium text-xs sm:text-sm whitespace-nowrap">
                    R$ {compra.valorParcela.toFixed(2).replace('.', ',')}
                </span>
            ),
        },
    ];

    return (
        <>
            <TabelaBase
                dados={ordenadas}
                colunas={colunas}
                emptyMessage="Nenhuma compra neste mês."
                onRowClick={handleRowClick}
            />

            {/* Modal de detalhes — abre ao clicar na linha */}
            <ModalDetalhesCompra
                aberto={modalAberto}
                compra={compraSelecionada}
                onFechar={handleFecharModal}
                onEditar={onEditar}
                onExcluir={onExcluir}
            />
        </>
    );
}