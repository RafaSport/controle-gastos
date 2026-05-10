'use client';

import { Cartao } from '@/types';
import { useEffect, useState } from 'react';
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
const CORES_CARTAO: Record<Cartao, string> = {
    NUBANK: '#820AD1',
    INTER: '#FF6600',
    HIPER: '#CC0000',
    ITAU: '#003087',
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

// Converte mês+ano para número total de meses (para comparação)
function emMeses(mes: number, ano: number) {
    return ano * 12 + mes;
}

export default function ModalCadastroCompra({
    aberto,
    usuarioId,
    onFechar,
    onSalvar,
}: Props) {
    const hoje = new Date();
    const mesAtual = hoje.getMonth() + 1;
    const anoAtual = hoje.getFullYear();

    const [cartao, setCartao] = useState<Cartao>('NUBANK');
    const [descricao, setDescricao] = useState('');
    const [mesCompra, setMesCompra] = useState(mesAtual);
    const [anoCompra, setAnoCompra] = useState(anoAtual);
    const [mesInicio, setMesInicio] = useState(mesAtual);
    const [anoInicio, setAnoInicio] = useState(anoAtual);
    const [qtdParcelas, setQtdParcelas] = useState(1);
    const [valorParcela, setValorParcela] = useState('');
    const [erro, setErro] = useState('');
    const [alerta, setAlerta] = useState('');
    const [carregando, setCarregando] = useState(false);

    // Reseta o formulário sempre que o modal abre
    useEffect(() => {
        if (aberto) {
            const agora = new Date();
            const m = agora.getMonth() + 1;
            const a = agora.getFullYear();
            setCartao('NUBANK');
            setDescricao('');
            setMesCompra(m);
            setAnoCompra(a);
            setMesInicio(m);
            setAnoInicio(a);
            setQtdParcelas(1);
            setValorParcela('');
            setErro('');
            setAlerta('');
        }
    }, [aberto]);

    // Garante que o início nunca fique antes da compra
    // e dispara alerta se o início for 3+ meses depois
    useEffect(() => {
        const compraEmMeses = emMeses(mesCompra, anoCompra);
        const inicioEmMeses = emMeses(mesInicio, anoInicio);
        const diferencaMeses = inicioEmMeses - compraEmMeses;

        // Corrige automaticamente se início ficou antes da compra
        if (inicioEmMeses < compraEmMeses) {
            setMesInicio(mesCompra);
            setAnoInicio(anoCompra);
            setAlerta('');
            return;
        }

        // Alerta amigável se início for 3+ meses depois da compra
        if (diferencaMeses >= 3) {
            const nomeMesInicio = MESES[mesInicio - 1];
            setAlerta(
                `O pagamento só começa em ${nomeMesInicio}/${anoInicio}, que é ${diferencaMeses} meses depois da compra. Isso está certo?`
            );
        } else {
            setAlerta('');
        }
    }, [mesCompra, anoCompra, mesInicio, anoInicio]);

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
        if (!valorParcela || parseFloat(valorParcela.replace(',', '.')) <= 0) {
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
                                        ? { backgroundColor: CORES_CARTAO[c] }
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

                {/* Mês e ano de início — nunca antes da compra */}
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
                            {MESES.map((m, i) => {
                                // Desabilita meses anteriores ao mês de compra no mesmo ano
                                const desabilitado =
                                    anoInicio === anoCompra &&
                                    i + 1 < mesCompra;
                                return (
                                    <option
                                        key={i}
                                        value={i + 1}
                                        disabled={desabilitado}
                                    >
                                        {m}
                                    </option>
                                );
                            })}
                        </select>
                    </div>
                    <Input
                        label="Ano de início"
                        type="number"
                        value={anoInicio}
                        onChange={(e) => setAnoInicio(Number(e.target.value))}
                    />
                </div>

                {/* Alerta de início muito distante da compra */}
                {alerta && (
                    <div className="flex items-start gap-2 bg-yellow-500/10 border border-yellow-500/30 rounded-lg px-3 py-2">
                        <span className="text-yellow-400 shrink-0 mt-0.5">
                            ⚠
                        </span>
                        <p className="text-xs text-yellow-400">{alerta}</p>
                    </div>
                )}

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