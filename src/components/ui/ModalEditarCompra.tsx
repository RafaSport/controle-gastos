'use client';

import { apiPut } from '@/lib/api-client';
import { Cartao, Compra } from '@/types';
import { useEffect, useState } from 'react';
import Botao from './Botao';
import Feedback from './Feedback';
import Input from './Input';
import Modal from './Modal';

interface Props {
    aberto: boolean;
    compra: Compra | null;
    onFechar: () => void;
    onSalvar: () => void;
}

const CARTOES: Cartao[] = ['NUBANK', 'INTER', 'HIPER', 'ITAU'];
const NOMES_CARTAO: Record<Cartao, string> = {
    NUBANK: 'Nubank',
    INTER: 'Inter',
    HIPER: 'Hiper',
    ITAU: 'Itaú',
};
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

export default function ModalEditarCompra({
    aberto,
    compra,
    onFechar,
    onSalvar,
}: Props) {
    const [cartao, setCartao] = useState<Cartao>('NUBANK');
    const [descricao, setDescricao] = useState('');
    const [mesCompra, setMesCompra] = useState(1);
    const [anoCompra, setAnoCompra] = useState(2025);
    const [mesInicio, setMesInicio] = useState(1);
    const [anoInicio, setAnoInicio] = useState(2025);
    const [qtdParcelas, setQtdParcelas] = useState(1);
    const [valorParcela, setValorParcela] = useState('');
    const [carregando, setCarregando] = useState(false);
    const [feedback, setFeedback] = useState<{
        tipo: 'sucesso' | 'erro';
        msg: string;
    } | null>(null);

    useEffect(() => {
        if (compra) {
            setCartao(compra.cartao);
            setDescricao(compra.descricao);
            setMesCompra(compra.mesCompra);
            setAnoCompra(compra.anoCompra);
            setMesInicio(compra.mesInicio);
            setAnoInicio(compra.anoInicio);
            setQtdParcelas(compra.qtdParcelas);
            setValorParcela(compra.valorParcela.toFixed(2).replace('.', ','));
            setFeedback(null);
        }
    }, [compra]);

    function calcularMesFinal() {
        const total = mesInicio + qtdParcelas - 1;
        const mesFinal = ((total - 1) % 12) + 1;
        const anoFinal = anoInicio + Math.floor((total - 1) / 12);
        return `${MESES[mesFinal - 1]}/${anoFinal}`;
    }

    async function handleSalvar() {
        setFeedback(null);

        if (!descricao.trim()) {
            setFeedback({ tipo: 'erro', msg: 'Descrição obrigatória.' });
            return;
        }
        if (!valorParcela || parseFloat(valorParcela) <= 0) {
            setFeedback({ tipo: 'erro', msg: 'Valor inválido.' });
            return;
        }

        setCarregando(true);

        try {
            await apiPut(`/api/compras/${compra?.id}`, {
                cartao,
                descricao: descricao.trim(),
                mesCompra,
                anoCompra,
                mesInicio,
                anoInicio,
                qtdParcelas,
                valorParcela: parseFloat(valorParcela.replace(',', '.')),
            });

            setCarregando(false);
            setFeedback({ tipo: 'sucesso', msg: 'Compra atualizada!' });
        } catch (err: any) {
            setCarregando(false);
            setFeedback({
                tipo: 'erro',
                msg: err.message || 'Erro ao editar compra.',
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
        onFechar();
    }

    return (
        <Modal
            aberto={aberto}
            titulo="Editar Compra"
            onFechar={handleFechar}
            tamanho="lg"
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
                        <div className="flex flex-col gap-1">
                            <label className="text-sm font-medium text-zinc-300">
                                Cartão
                            </label>
                            <div className="flex gap-2">
                                {CARTOES.map((c) => (
                                    <button
                                        key={c}
                                        type="button"
                                        onClick={() => setCartao(c)}
                                        style={
                                            cartao === c
                                                ? {
                                                      backgroundColor: {
                                                          NUBANK: '#820AD1',
                                                          INTER: '#FF6600',
                                                          HIPER: '#CC0000',
                                                          ITAU: '#003087',
                                                      }[c],
                                                  }
                                                : {}
                                        }
                                        className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all ${
                                            cartao === c
                                                ? 'text-white'
                                                : 'bg-zinc-800 text-zinc-400 hover:bg-zinc-700'
                                        }`}
                                    >
                                        {NOMES_CARTAO[c]}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <Input
                            label="Descrição"
                            value={descricao}
                            onChange={(e) => setDescricao(e.target.value)}
                        />

                        <div className="grid grid-cols-2 gap-3">
                            <div className="flex flex-col gap-1">
                                <label className="text-sm font-medium text-zinc-300">
                                    Mês da compra
                                </label>
                                <select
                                    value={mesCompra}
                                    onChange={(e) =>
                                        setMesCompra(Number(e.target.value))
                                    }
                                    className="bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2.5 text-sm text-zinc-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                >
                                    {MESES.map((m, i) => (
                                        <option key={i} value={i + 1}>
                                            {m}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <Input
                                label="Ano da compra"
                                type="number"
                                value={anoCompra}
                                onChange={(e) =>
                                    setAnoCompra(Number(e.target.value))
                                }
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                            <div className="flex flex-col gap-1">
                                <label className="text-sm font-medium text-zinc-300">
                                    Mês de início
                                </label>
                                <select
                                    value={mesInicio}
                                    onChange={(e) =>
                                        setMesInicio(Number(e.target.value))
                                    }
                                    className="bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2.5 text-sm text-zinc-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                >
                                    {MESES.map((m, i) => (
                                        <option key={i} value={i + 1}>
                                            {m}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <Input
                                label="Ano de início"
                                type="number"
                                value={anoInicio}
                                onChange={(e) =>
                                    setAnoInicio(Number(e.target.value))
                                }
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                            <Input
                                label="Qtd. parcelas"
                                type="number"
                                value={qtdParcelas}
                                onChange={(e) =>
                                    setQtdParcelas(Number(e.target.value))
                                }
                            />
                            <Input
                                label="Valor da parcela (R$)"
                                placeholder="Ex: 150,00"
                                value={valorParcela}
                                onChange={(e) =>
                                    setValorParcela(e.target.value)
                                }
                            />
                        </div>

                        <div className="bg-zinc-800 rounded-lg px-3 py-2">
                            <p className="text-xs text-zinc-400">
                                Término previsto:
                                <span className="text-blue-400 font-medium ml-1">
                                    {calcularMesFinal()}
                                </span>
                            </p>
                        </div>

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