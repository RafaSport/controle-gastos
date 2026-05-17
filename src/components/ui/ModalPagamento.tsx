'use client';

import { apiPost } from '@/lib/api-client';
import { useState } from 'react';
import Botao from './Botao';
import Feedback from './Feedback';
import Input from './Input';
import Modal from './Modal';

interface Props {
    aberto: boolean;
    totalDoMes: number;
    usuarioId: string;
    mes: number;
    ano: number;
    onFechar: () => void;
    onSalvar: () => void;
}

export default function ModalPagamento({
    aberto,
    totalDoMes,
    usuarioId,
    mes,
    ano,
    onFechar,
    onSalvar,
}: Props) {
    const [tipoPagamento, setTipoPagamento] = useState<'total' | 'parcial'>(
        'total'
    );
    const [valorParcial, setValorParcial] = useState('');
    const [carregando, setCarregando] = useState(false);
    const [feedback, setFeedback] = useState<{
        tipo: 'sucesso' | 'erro';
        msg: string;
    } | null>(null);

    async function handlePagar() {
        setFeedback(null);

        const totalPago =
            tipoPagamento === 'total'
                ? totalDoMes
                : parseFloat(valorParcial.replace(',', '.'));

        if (tipoPagamento === 'parcial') {
            if (!valorParcial || isNaN(totalPago) || totalPago <= 0) {
                setFeedback({ tipo: 'erro', msg: 'Informe um valor válido.' });
                return;
            }
            if (totalPago > totalDoMes) {
                setFeedback({
                    tipo: 'erro',
                    msg: `O valor não pode ser maior que o total do mês (R$ ${totalDoMes.toFixed(2).replace('.', ',')}).`,
                });
                return;
            }
        }

        setCarregando(true);

        try {
            await apiPost('/api/meses', { usuarioId, mes, ano, totalPago });

            setCarregando(false);
            setFeedback({ tipo: 'sucesso', msg: 'Pagamento registrado!' });
        } catch (err: any) {
            setCarregando(false);
            setFeedback({
                tipo: 'erro',
                msg: err.message || 'Erro ao registrar pagamento.',
            });
        }
    }

    function handleConcluir() {
        const eraSucesso = feedback?.tipo === 'sucesso';
        setFeedback(null);

        if (eraSucesso) {
            setValorParcial('');
            setTipoPagamento('total');
            onSalvar();
            onFechar();
        }
    }

    function handleFechar() {
        setFeedback(null);
        setValorParcial('');
        setTipoPagamento('total');
        onFechar();
    }

    return (
        <Modal
            aberto={aberto}
            titulo="Registrar Pagamento"
            onFechar={handleFechar}
        >
            <div className="flex flex-col gap-4">
                {feedback ? (
                    <Feedback
                        tipo={feedback.tipo}
                        mensagem={feedback.msg}
                        onConcluir={handleConcluir}
                    />
                ) : (
                    <>
                        <div className="bg-zinc-800 rounded-lg px-4 py-3 text-center">
                            <p className="text-xs text-zinc-500 mb-1">
                                Total do mês
                            </p>
                            <p className="text-2xl font-bold text-zinc-100">
                                R$ {totalDoMes.toFixed(2).replace('.', ',')}
                            </p>
                        </div>

                        <div className="flex gap-2">
                            <button
                                type="button"
                                onClick={() => setTipoPagamento('total')}
                                className={`flex-1 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                                    tipoPagamento === 'total'
                                        ? 'bg-green-600 text-white'
                                        : 'bg-zinc-800 text-zinc-400 hover:bg-zinc-700'
                                }`}
                            >
                                Pagar total
                            </button>
                            <button
                                type="button"
                                onClick={() => setTipoPagamento('parcial')}
                                className={`flex-1 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                                    tipoPagamento === 'parcial'
                                        ? 'bg-yellow-500 text-zinc-900'
                                        : 'bg-zinc-800 text-zinc-400 hover:bg-zinc-700'
                                }`}
                            >
                                Pagar parcial
                            </button>
                        </div>

                        {tipoPagamento === 'parcial' && (
                            <Input
                                label="Valor a pagar (R$)"
                                placeholder="Ex: 350,00"
                                value={valorParcial}
                                onChange={(e) =>
                                    setValorParcial(e.target.value)
                                }
                                onKeyDown={(e) =>
                                    e.key === 'Enter' && handlePagar()
                                }
                                autoFocus
                            />
                        )}

                        {tipoPagamento === 'parcial' &&
                            valorParcial &&
                            (() => {
                                const pago =
                                    parseFloat(
                                        valorParcial.replace(',', '.')
                                    ) || 0;
                                const diferenca = totalDoMes - pago;
                                return diferenca > 0 ? (
                                    <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg px-3 py-2">
                                        <p className="text-xs text-yellow-400">
                                            R${' '}
                                            {diferenca
                                                .toFixed(2)
                                                .replace('.', ',')}{' '}
                                            ficará como dívida no próximo mês.
                                        </p>
                                    </div>
                                ) : null;
                            })()}

                        <div className="flex gap-2 justify-end">
                            <Botao cor="cinza" onClick={handleFechar}>
                                Cancelar
                            </Botao>
                            <Botao
                                cor={
                                    tipoPagamento === 'total'
                                        ? 'verde'
                                        : 'amarelo'
                                }
                                carregando={carregando}
                                onClick={handlePagar}
                            >
                                Confirmar pagamento
                            </Botao>
                        </div>
                    </>
                )}
            </div>
        </Modal>
    );
}