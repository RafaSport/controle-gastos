'use client';

import { Cartao } from '@/types';
import { useState } from 'react';
import Botao from './Botao';
import Input from './Input';
import Modal from './Modal';

interface Props {
    aberto: boolean;
    usuarioId: string;
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

export default function ModalCadastroCompra({
    aberto,
    usuarioId,
    onFechar,
    onSalvar,
}: Props) {
    const hoje = new Date();

    const [cartao, setCartao] = useState<Cartao>('NUBANK');
    const [descricao, setDescricao] = useState('');
    const [mesCompra, setMesCompra] = useState(hoje.getMonth() + 1);
    const [anoCompra, setAnoCompra] = useState(hoje.getFullYear());
    const [mesInicio, setMesInicio] = useState(hoje.getMonth() + 1);
    const [anoInicio, setAnoInicio] = useState(hoje.getFullYear());
    const [qtdParcelas, setQtdParcelas] = useState(1);
    const [valorParcela, setValorParcela] = useState('');
    const [erro, setErro] = useState('');
    const [carregando, setCarregando] = useState(false);

    // Calcula e exibe o mês final automaticamente
    function calcularMesFinal() {
        const total = mesInicio + qtdParcelas - 1;
        const mesFinal = ((total - 1) % 12) + 1;
        const anoFinal = anoInicio + Math.floor((total - 1) / 12);
        return `${MESES[mesFinal - 1]}/${anoFinal}`;
    }

    async function handleSalvar() {
        setErro('');

        if (!descricao.trim()) {
            setErro('Descrição obrigatória.');
            return;
        }
        if (!valorParcela || parseFloat(valorParcela) <= 0) {
            setErro('Valor inválido.');
            return;
        }

        setCarregando(true);

        const res = await fetch('/api/compras', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                usuarioId,
                cartao,
                descricao: descricao.trim(),
                mesCompra,
                anoCompra,
                mesInicio,
                anoInicio,
                qtdParcelas,
                valorParcela: parseFloat(valorParcela.replace(',', '.')),
            }),
        });

        setCarregando(false);

        if (!res.ok) {
            setErro('Erro ao cadastrar compra.');
            return;
        }

        // Limpa e fecha
        setDescricao('');
        setValorParcela('');
        setQtdParcelas(1);
        onSalvar();
        onFechar();
    }

    return (
        <Modal
            aberto={aberto}
            titulo="Nova Compra"
            onFechar={onFechar}
            tamanho="lg"
        >
            <div className="flex flex-col gap-4">
                {/* Seletor de cartão */}
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
                                className={`
                                    flex-1 py-2 rounded-lg text-xs font-bold transition-all
                                    ${cartao === c ? 'text-white' : 'bg-zinc-800 text-zinc-400 hover:bg-zinc-700'}
                                `}
                            >
                                {NOMES_CARTAO[c]}
                            </button>
                        ))}
                    </div>
                </div>

                <Input
                    label="Descrição"
                    placeholder="Ex: Notebook Dell"
                    value={descricao}
                    onChange={(e) => setDescricao(e.target.value)}
                />

                {/* Mês e ano da compra */}
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
                        onChange={(e) => setAnoCompra(Number(e.target.value))}
                    />
                </div>

                {/* Mês e ano de início */}
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
                        onChange={(e) => setAnoInicio(Number(e.target.value))}
                    />
                </div>

                {/* Parcelas e valor */}
                <div className="grid grid-cols-2 gap-3">
                    <Input
                        label="Qtd. parcelas"
                        type="number"
                        value={qtdParcelas}
                        onChange={(e) => setQtdParcelas(Number(e.target.value))}
                    />
                    <Input
                        label="Valor da parcela (R$)"
                        placeholder="Ex: 150,00"
                        value={valorParcela}
                        onChange={(e) => setValorParcela(e.target.value)}
                    />
                </div>

                {/* Mês final calculado automaticamente */}
                <div className="bg-zinc-800 rounded-lg px-3 py-2">
                    <p className="text-xs text-zinc-400">
                        Término previsto:
                        <span className="text-blue-400 font-medium ml-1">
                            {calcularMesFinal()}
                        </span>
                    </p>
                </div>

                {erro && (
                    <div className="flex items-start gap-2 bg-red-500/10 border border-red-500/30 rounded-lg px-3 py-2">
                        <span className="text-red-400 shrink-0">⚠</span>
                        <p className="text-xs text-red-400">{erro}</p>
                    </div>
                )}

                <div className="flex gap-2 justify-end">
                    <Botao cor="cinza" onClick={onFechar}>
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
            </div>
        </Modal>
    );
}