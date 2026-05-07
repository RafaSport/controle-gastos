'use client';

import { MesFechado } from '@/types';
import { useState } from 'react';
import Botao from './Botao';
import Modal from './Modal';

interface Props {
    mesesFechados: MesFechado[];
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

export default function CardDividaAnterior({
    mesesFechados,
    mesSelecionado,
    anoSelecionado,
}: Props) {
    const [modalAberto, setModalAberto] = useState(false);

    // Filtra apenas meses anteriores ao selecionado que tiveram diferença
    const mesesComDivida = mesesFechados.filter((mf) => {
        const ehAnterior =
            mf.ano * 12 + mf.mes < anoSelecionado * 12 + mesSelecionado;
        const temDivida = mf.totalDoMes - mf.totalPago > 0;
        return ehAnterior && temDivida;
    });

    // Total acumulado de dívidas anteriores
    const totalDivida = mesesComDivida.reduce(
        (acc, mf) => acc + (mf.totalDoMes - mf.totalPago),
        0
    );

    if (totalDivida <= 0) return null;

    return (
        <>
            {/* Card resumo da dívida */}
            <div className="w-full bg-red-500/10 border border-red-500/30 rounded-xl px-4 py-3 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-red-500/20 flex items-center justify-center">
                        <span className="text-red-400 text-xs font-bold">
                            !
                        </span>
                    </div>
                    <div>
                        <p className="text-sm font-semibold text-red-400">
                            Dívida anterior
                        </p>
                        <p className="text-xs text-zinc-500">
                            Meses com pagamento pendente
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-4">
                    <div className="text-right">
                        <p className="text-xs text-zinc-500">Total</p>
                        <p className="text-sm font-bold text-red-400">
                            R$ {totalDivida.toFixed(2).replace('.', ',')}
                        </p>
                    </div>
                    <Botao
                        cor="cinza"
                        tamanho="sm"
                        onClick={() => setModalAberto(true)}
                    >
                        Detalhes
                    </Botao>
                </div>
            </div>

            {/* Modal com detalhes por mês */}
            <Modal
                aberto={modalAberto}
                titulo="Detalhes da Dívida"
                onFechar={() => setModalAberto(false)}
            >
                <div className="flex flex-col gap-4">
                    <div className="rounded-lg border border-zinc-800 overflow-hidden">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="bg-zinc-800 text-zinc-400 text-xs uppercase tracking-wide">
                                    <th className="px-3 py-2 text-left">Mês</th>
                                    <th className="px-3 py-2 text-right">
                                        Total
                                    </th>
                                    <th className="px-3 py-2 text-right">
                                        Pago
                                    </th>
                                    <th className="px-3 py-2 text-right">
                                        Diferença
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {mesesComDivida.map((mf, index) => {
                                    const diferenca =
                                        mf.totalDoMes - mf.totalPago;
                                    return (
                                        <tr
                                            key={mf.id}
                                            className={
                                                index % 2 === 0
                                                    ? 'bg-zinc-900'
                                                    : 'bg-zinc-800'
                                            }
                                        >
                                            <td className="px-3 py-2 text-zinc-300">
                                                {MESES[mf.mes - 1]}/{mf.ano}
                                            </td>
                                            <td className="px-3 py-2 text-right text-zinc-400">
                                                R${' '}
                                                {mf.totalDoMes
                                                    .toFixed(2)
                                                    .replace('.', ',')}
                                            </td>
                                            <td className="px-3 py-2 text-right text-green-400">
                                                R${' '}
                                                {mf.totalPago
                                                    .toFixed(2)
                                                    .replace('.', ',')}
                                            </td>
                                            <td className="px-3 py-2 text-right text-red-400 font-medium">
                                                R${' '}
                                                {diferenca
                                                    .toFixed(2)
                                                    .replace('.', ',')}
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>

                    {/* Total geral da dívida */}
                    <div className="flex justify-end">
                        <div className="text-right">
                            <p className="text-xs text-zinc-500">
                                Total da dívida
                            </p>
                            <p className="text-base font-bold text-red-400">
                                R$ {totalDivida.toFixed(2).replace('.', ',')}
                            </p>
                        </div>
                    </div>
                </div>
            </Modal>
        </>
    );
}