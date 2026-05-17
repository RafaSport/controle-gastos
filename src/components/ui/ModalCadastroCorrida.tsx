'use client';

import { apiPost } from '@/lib/api-client';
import { useEffect, useState } from 'react';
import Botao from './Botao';
import Feedback from './Feedback';
import Input from './Input';
import Modal from './Modal';

interface Props {
    aberto: boolean;
    usuarioId: string;
    mesEmAberto: number;
    anoEmAberto: number;
    onFechar: () => void;
    onSalvar: () => void;
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

function formatarData(data: Date): string {
    return `${data.getFullYear()}-${String(data.getMonth() + 1).padStart(2, '0')}-${String(data.getDate()).padStart(2, '0')}`;
}

function diferencaEmDias(dataStr: string): number {
    const hoje = new Date();
    hoje.setHours(0, 0, 0, 0);
    const dataSelecionada = new Date(`${dataStr}T00:00:00`);
    return Math.round(
        (hoje.getTime() - dataSelecionada.getTime()) / (1000 * 60 * 60 * 24)
    );
}

export default function ModalCadastroCorrida({
    aberto,
    usuarioId,
    mesEmAberto,
    anoEmAberto,
    onFechar,
    onSalvar,
}: Props) {
    const hoje = new Date();
    const dataHoje = formatarData(hoje);

    const [data, setData] = useState(dataHoje);
    const [valor, setValor] = useState('');
    const [alerta, setAlerta] = useState('');
    const [carregando, setCarregando] = useState(false);
    const [feedback, setFeedback] = useState<{
        tipo: 'sucesso' | 'erro';
        msg: string;
    } | null>(null);

    useEffect(() => {
        if (aberto) {
            setData(formatarData(new Date()));
            setValor('');
            setAlerta('');
            setFeedback(null);
        }
    }, [aberto]);

    useEffect(() => {
        if (!data) return;
        const dias = diferencaEmDias(data);
        if (dias >= 3) {
            setAlerta(`Esta corrida foi há ${dias} dias. Tem certeza da data?`);
        } else {
            setAlerta('');
        }
    }, [data]);

    function handleMudancaData(novaData: string) {
        if (novaData > dataHoje) return;
        setData(novaData);
    }

    async function handleSalvar() {
        setFeedback(null);

        if (!data) {
            setFeedback({ tipo: 'erro', msg: 'Data obrigatória.' });
            return;
        }

        if (!valor || parseFloat(valor.replace(',', '.')) <= 0) {
            setFeedback({ tipo: 'erro', msg: 'Valor inválido.' });
            return;
        }

        setCarregando(true);

        try {
            await apiPost('/api/corridas', {
                usuarioId,
                data,
                mesReferencia: mesEmAberto,
                anoReferencia: anoEmAberto,
                valor: parseFloat(valor.replace(',', '.')),
            });

            setCarregando(false);
            setFeedback({ tipo: 'sucesso', msg: 'Corrida cadastrada!' });
        } catch (err: any) {
            setCarregando(false);
            setFeedback({
                tipo: 'erro',
                msg: err.message || 'Erro ao cadastrar corrida.',
            });
        }
    }

    function handleConcluir() {
        const eraSucesso = feedback?.tipo === 'sucesso';
        setFeedback(null);

        if (eraSucesso) {
            onSalvar();
            onFechar();
        }
    }

    function handleFechar() {
        setFeedback(null);
        setAlerta('');
        onFechar();
    }

    return (
        <Modal
            aberto={aberto}
            titulo="Nova Corrida Uber"
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
                        <Input
                            label="Data da corrida"
                            type="date"
                            value={data}
                            max={dataHoje}
                            onChange={(e) => handleMudancaData(e.target.value)}
                        />

                        <div className="bg-zinc-800 rounded-lg px-3 py-2">
                            <p className="text-xs text-zinc-400">
                                Corrida será lançada em:
                                <span className="text-blue-400 font-medium ml-1">
                                    {MESES[mesEmAberto - 1]}/{anoEmAberto}
                                </span>
                            </p>
                        </div>

                        {alerta && (
                            <div className="flex items-start gap-2 bg-yellow-500/10 border border-yellow-500/30 rounded-lg px-3 py-2">
                                <span className="text-yellow-400 shrink-0 mt-0.5">
                                    !
                                </span>
                                <p className="text-xs text-yellow-400">
                                    {alerta}
                                </p>
                            </div>
                        )}

                        <Input
                            label="Valor (R$)"
                            placeholder="Ex: 25,50"
                            value={valor}
                            onChange={(e) => setValor(e.target.value)}
                            onKeyDown={(e) =>
                                e.key === 'Enter' && handleSalvar()
                            }
                        />

                        <div className="flex gap-2 justify-end">
                            <Botao cor="cinza" onClick={handleFechar}>
                                Cancelar
                            </Botao>
                            <Botao
                                cor="verde"
                                carregando={carregando}
                                onClick={handleSalvar}
                            >
                                Salvar
                            </Botao>
                        </div>
                    </>
                )}
            </div>
        </Modal>
    );
}