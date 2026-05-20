'use client';

import { calcularParcelaAtual } from '@/lib/utils';
import { Cartao, Compra } from '@/types';
import Botao from './Botao';
import CartaoTag from './CartaoTag';
import Modal from './Modal';

interface ModalDetalhesCompraProps {
    aberto: boolean;
    compra: Compra | null;
    onFechar: () => void;
    // Ações opcionais — só admin passa essas props
    onEditar?: (compra: Compra) => void;
    onExcluir?: (compra: Compra) => void;
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

function formatarMesAno(mes: number, ano: number): string {
    return `${MESES[mes - 1]}/${ano}`;
}

export default function ModalDetalhesCompra({
    aberto,
    compra,
    onFechar,
    onEditar,
    onExcluir,
}: ModalDetalhesCompraProps) {
    if (!compra) return null;

    const temAcoes = !!onEditar || !!onExcluir;

    // Usa a função centralizada do utils para calcular parcela atual
    const parcelaAtual = calcularParcelaAtual(
        compra.mesInicio,
        compra.anoInicio,
        compra.qtdParcelas
    );

    return (
        <Modal
            aberto={aberto}
            titulo="Detalhes da Compra"
            onFechar={onFechar}
            tamanho="md"
        >
            <div className="flex flex-col gap-4">
                {/* Grid de detalhes */}
                <div className="grid grid-cols-2 gap-3 text-sm">
                    <div className="flex flex-col gap-1">
                        <span className="text-xs text-zinc-500 uppercase tracking-wide">
                            Cartão
                        </span>
                        <CartaoTag cartao={compra.cartao as Cartao} />
                    </div>

                    <div className="flex flex-col gap-1">
                        <span className="text-xs text-zinc-500 uppercase tracking-wide">
                            Valor da Parcela
                        </span>
                        <span className="text-zinc-100 font-semibold">
                            R${' '}
                            {compra.valorParcela.toFixed(2).replace('.', ',')}
                        </span>
                    </div>

                    <div className="flex flex-col gap-1 col-span-2">
                        <span className="text-xs text-zinc-500 uppercase tracking-wide">
                            Descrição
                        </span>
                        <span className="text-zinc-100">
                            {compra.descricao}
                        </span>
                    </div>

                    <div className="flex flex-col gap-1">
                        <span className="text-xs text-zinc-500 uppercase tracking-wide">
                            Mês da Compra
                        </span>
                        <span className="text-zinc-100">
                            {formatarMesAno(compra.mesCompra, compra.anoCompra)}
                        </span>
                    </div>

                    <div className="flex flex-col gap-1">
                        <span className="text-xs text-zinc-500 uppercase tracking-wide">
                            Início
                        </span>
                        <span className="text-zinc-100">
                            {formatarMesAno(compra.mesInicio, compra.anoInicio)}
                        </span>
                    </div>

                    <div className="flex flex-col gap-1">
                        <span className="text-xs text-zinc-500 uppercase tracking-wide">
                            Parcelas
                        </span>
                        {/* Usa a função centralizada do utils */}
                        <span className="text-zinc-100 font-medium">
                            {parcelaAtual}/{compra.qtdParcelas}
                        </span>
                    </div>

                    <div className="flex flex-col gap-1">
                        <span className="text-xs text-zinc-500 uppercase tracking-wide">
                            Término
                        </span>
                        <span className="text-zinc-100">
                            {formatarMesAno(compra.mesFinal, compra.anoFinal)}
                        </span>
                    </div>
                </div>

                {/* Ações — só aparecem se onEditar/onExcluir forem passados */}
                {temAcoes && (
                    <div className="flex gap-2 pt-2 border-t border-zinc-800">
                        {onEditar && (
                            <Botao
                                cor="amarelo"
                                tamanho="sm"
                                onClick={() => {
                                    onEditar(compra);
                                    onFechar();
                                }}
                            >
                                Editar
                            </Botao>
                        )}
                        {onExcluir && (
                            <Botao
                                cor="vermelho"
                                tamanho="sm"
                                onClick={() => {
                                    onExcluir(compra);
                                    onFechar();
                                }}
                            >
                                Excluir
                            </Botao>
                        )}
                    </div>
                )}
            </div>
        </Modal>
    );
}