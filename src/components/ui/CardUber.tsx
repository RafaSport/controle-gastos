'use client';

import { apiDelete } from '@/lib/api-client';
import { Corrida } from '@/types';
import { Trash2 } from 'lucide-react';
import { useSession } from 'next-auth/react';
import { useState } from 'react';
import Botao from './Botao';
import Feedback from './Feedback';
import Modal from './Modal';
import ModalConfirmacao from './ModalConfirmacao';

interface CardUberProps {
    usuarioId: string;
    mes: number;
    ano: number;
    corridas: Corrida[];
    carregando: boolean;
    /** Callback chamado após excluir uma corrida (para recarregar dados no pai) */
    onExcluir?: () => void;
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

function formatarDataCorrida(data: string) {
    const dataCorrida = new Date(data);
    return dataCorrida.toLocaleDateString('pt-BR', { timeZone: 'UTC' });
}

export default function CardUber({
    usuarioId,
    mes,
    ano,
    corridas,
    carregando,
    onExcluir,
}: CardUberProps) {
    const { data: session } = useSession();
    const isAdmin = (session?.user as any)?.papel === 'ADMIN';

    const [modalAberto, setModalAberto] = useState(false);
    const [modalConfirmar, setModalConfirmar] = useState(false);
    const [corridaExcluindo, setCorridaExcluindo] = useState<Corrida | null>(
        null
    );
    const [excluindo, setExcluindo] = useState(false);
    const [feedback, setFeedback] = useState<{
        tipo: 'sucesso' | 'erro';
        msg: string;
    } | null>(null);

    const total = corridas.reduce((acc, c) => acc + c.valor, 0);

    /** Abre modal de confirmação para excluir corrida */
    function handleExcluir(corrida: Corrida) {
        setCorridaExcluindo(corrida);
        setModalConfirmar(true);
    }

    /** Executa exclusão após confirmação */
    async function confirmarExcluir() {
        if (!corridaExcluindo) return;

        setExcluindo(true);

        try {
            await apiDelete(`/api/corridas/${corridaExcluindo.id}`);
            setExcluindo(false);
            setModalConfirmar(false);
            setCorridaExcluindo(null);
            setFeedback({ tipo: 'sucesso', msg: 'Corrida excluída!' });

            // Notifica o pai para recarregar dados
            if (onExcluir) onExcluir();
        } catch (err: any) {
            setExcluindo(false);
            setModalConfirmar(false);
            setCorridaExcluindo(null);
            setFeedback({
                tipo: 'erro',
                msg: err.message || 'Erro ao excluir corrida.',
            });
        }
    }

    function handleFecharFeedback() {
        setFeedback(null);
    }

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

            {/* Modal com tabela de corridas + exclusão admin */}
            <Modal
                aberto={modalAberto}
                titulo={`Corridas — ${MESES[mes - 1]}/${ano}`}
                onFechar={() => {
                    setModalAberto(false);
                    setFeedback(null);
                }}
                tamanho="md"
            >
                {feedback ? (
                    <Feedback
                        tipo={feedback.tipo}
                        mensagem={feedback.msg}
                        onConcluir={handleFecharFeedback}
                    />
                ) : carregando ? (
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
                                        {/* Coluna de ações só para admin */}
                                        {isAdmin && (
                                            <th className="px-3 py-2 text-center w-12">
                                                Ação
                                            </th>
                                        )}
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
                                                {formatarDataCorrida(
                                                    corrida.data
                                                )}
                                            </td>
                                            <td className="px-3 py-2 text-right text-zinc-100 font-medium">
                                                R${' '}
                                                {corrida.valor
                                                    .toFixed(2)
                                                    .replace('.', ',')}
                                            </td>
                                            {/* Botão excluir só para admin */}
                                            {isAdmin && (
                                                <td className="px-3 py-2 text-center">
                                                    <button
                                                        onClick={() =>
                                                            handleExcluir(
                                                                corrida
                                                            )
                                                        }
                                                        className="p-1.5 rounded-md bg-red-500/10 hover:bg-red-500/20 text-red-400 transition-colors"
                                                        title="Excluir corrida"
                                                    >
                                                        <Trash2 size={14} />
                                                    </button>
                                                </td>
                                            )}
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

            {/* Modal de confirmação para exclusão */}
            <ModalConfirmacao
                aberto={modalConfirmar}
                titulo="Excluir Corrida"
                mensagem={
                    corridaExcluindo
                        ? `Deseja excluir a corrida de ${formatarDataCorrida(corridaExcluindo.data)} no valor de R$ ${corridaExcluindo.valor.toFixed(2).replace('.', ',')}?`
                        : 'Deseja excluir esta corrida?'
                }
                textoConfirmar="Excluir"
                textoCancelar="Cancelar"
                corConfirmar="vermelho"
                carregando={excluindo}
                onConfirmar={confirmarExcluir}
                onCancelar={() => {
                    setModalConfirmar(false);
                    setCorridaExcluindo(null);
                }}
            />
        </>
    );
}
