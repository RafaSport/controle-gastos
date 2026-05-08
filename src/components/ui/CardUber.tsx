'use client';

import { Corrida } from '@/types';
import { useState } from 'react';
import Botao from './Botao';
import Modal from './Modal';

interface CardUberProps {
    usuarioId: string;
    mes: number;
    ano: number;
    corridas: Corrida[]; // recebe as corridas já carregadas
    carregando: boolean;
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

export default function CardUber({
    usuarioId,
    mes,
    ano,
    corridas,
    carregando,
}: CardUberProps) {
    const [modalAberto, setModalAberto] = useState(false);

    // Total calculado a partir das corridas recebidas
    const total = corridas.reduce((acc, c) => acc + c.valor, 0);

    return (
        <>
            {/* Card resumo do Uber */}
            <div className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-black border border-zinc-700 flex items-center justify-center">
                        <span className="text-white text-xs font-bold">U</span>
                    </div>
                    <div>
                        <p className="text-sm font-semibold text-zinc-100">
                            Uber
                        </p>
                        <p className="text-xs text-zinc-500">
                            {MESES[mes - 1]}/{ano}
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-4">
                    {/* Total já visível no card */}
                    {!carregando && (
                        <div className="text-right">
                            <p className="text-xs text-zinc-500">Total</p>
                            <p className="text-sm font-bold text-zinc-100">
                                R$ {total.toFixed(2).replace('.', ',')}
                            </p>
                        </div>
                    )}

                    <Botao
                        cor="cinza"
                        tamanho="sm"
                        onClick={() => setModalAberto(true)}
                    >
                        Detalhes
                    </Botao>
                </div>
            </div>

            {/* Modal com tabela de corridas */}
            <Modal
                aberto={modalAberto}
                titulo={`Corridas — ${MESES[mes - 1]}/${ano}`}
                onFechar={() => setModalAberto(false)}
                tamanho="md"
            >
                {carregando ? (
                    <p className="text-center text-zinc-500 text-sm py-6">
                        Carregando...
                    </p>
                ) : corridas.length === 0 ? (
                    <p className="text-center text-zinc-500 text-sm py-6">
                        Nenhuma corrida neste mês.
                    </p>
                ) : (
                    <div className="flex flex-col gap-4">
                        <div className="rounded-lg border border-zinc-800 overflow-hidden">
                            <table className="w-full text-sm">
                                <thead>
                                    <tr className="bg-zinc-800 text-zinc-400 text-xs uppercase tracking-wide">
                                        <th className="px-3 py-2 text-left">
                                            Data
                                        </th>
                                        <th className="px-3 py-2 text-right">
                                            Valor
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {corridas.map((corrida, index) => (
                                        <tr
                                            key={corrida.id}
                                            className={
                                                index % 2 === 0
                                                    ? 'bg-zinc-900'
                                                    : 'bg-zinc-800'
                                            }
                                        >
                                            <td className="px-3 py-2 text-zinc-300">
                                                {new Date(
                                                    corrida.data
                                                ).toLocaleDateString('pt-BR')}
                                            </td>
                                            <td className="px-3 py-2 text-right text-zinc-100 font-medium">
                                                R${' '}
                                                {corrida.valor
                                                    .toFixed(2)
                                                    .replace('.', ',')}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        <div className="flex justify-end">
                            <div className="text-right">
                                <p className="text-xs text-zinc-500">
                                    Total do mês
                                </p>
                                <p className="text-base font-bold text-zinc-100">
                                    R$ {total.toFixed(2).replace('.', ',')}
                                </p>
                            </div>
                        </div>
                    </div>
                )}
            </Modal>
        </>
    );
}