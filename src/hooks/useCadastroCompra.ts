/**
 * Hook que encapsula toda a lógica de estado, validação
 * e submit do formulário de cadastro de compra.
 */

import { apiPost } from '@/lib/api-client';
import { AppError } from '@/lib/errors';
import { calcularMesFinal, paraIndiceMes } from '@/lib/utils';
import { Cartao } from '@/types';
import { useEffect, useState } from 'react';

// ============================================
// INTERFACE
// ============================================

interface UseCadastroCompraProps {
    usuarioId: string;
    aberto: boolean;
    onSalvar: () => void;
    onFechar: () => void;
}

interface UseCadastroCompraReturn {
    cartao: Cartao;
    setCartao: (c: Cartao) => void;
    descricao: string;
    setDescricao: (d: string) => void;
    mesCompra: number;
    setMesCompra: (m: number) => void;
    anoCompra: number;
    setAnoCompra: (a: number) => void;
    mesInicio: number;
    setMesInicio: (m: number) => void;
    anoInicio: number;
    setAnoInicio: (a: number) => void;
    qtdParcelas: number;
    setQtdParcelas: (q: number) => void;
    valorParcela: string;
    setValorParcela: (v: string) => void;
    carregando: boolean;
    feedback: { tipo: 'sucesso' | 'erro'; msg: string } | null;
    alertaInicio: string;
    alertaCompra: string;
    mesAtual: number;
    anoAtual: number;
    mesFinalPreview: string;
    handleSalvar: () => Promise<void>;
    limparFeedback: () => void;
}

// ============================================
// CONSTANTES
// ============================================

export const MESES = [
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

// ============================================
// HOOK PRINCIPAL
// ============================================

export function useCadastroCompra({
    usuarioId,
    aberto,
    onSalvar,
    onFechar,
}: UseCadastroCompraProps): UseCadastroCompraReturn {
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

    const [carregando, setCarregando] = useState(false);
    const [feedback, setFeedback] = useState<{
        tipo: 'sucesso' | 'erro';
        msg: string;
    } | null>(null);
    const [alertaInicio, setAlertaInicio] = useState('');
    const [alertaCompra, setAlertaCompra] = useState('');

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
            setFeedback(null);
            setAlertaInicio('');
            setAlertaCompra('');
        }
    }, [aberto]);

    useEffect(() => {
        const compraEmMeses = paraIndiceMes(mesCompra, anoCompra);
        const atualEmMeses = paraIndiceMes(mesAtual, anoAtual);
        const diferencaMeses = atualEmMeses - compraEmMeses;

        if (compraEmMeses > atualEmMeses) {
            setMesCompra(mesAtual);
            setAnoCompra(anoAtual);
            setAlertaCompra('');
            return;
        }

        if (diferencaMeses >= 3) {
            setAlertaCompra(
                `Esta compra foi há ${diferencaMeses} meses (${MESES[mesCompra - 1]}/${anoCompra}). Isso está certo?`
            );
        } else {
            setAlertaCompra('');
        }
    }, [mesCompra, anoCompra, mesAtual, anoAtual]);

    useEffect(() => {
        const compraEmMeses = paraIndiceMes(mesCompra, anoCompra);
        const inicioEmMeses = paraIndiceMes(mesInicio, anoInicio);
        const diferencaMeses = inicioEmMeses - compraEmMeses;

        if (inicioEmMeses < compraEmMeses) {
            setMesInicio(mesCompra);
            setAnoInicio(anoCompra);
            setAlertaInicio('');
            return;
        }

        if (diferencaMeses >= 3) {
            setAlertaInicio(
                `O pagamento só começa em ${MESES[mesInicio - 1]}/${anoInicio}, que é ${diferencaMeses} meses depois da compra. Isso está certo?`
            );
        } else {
            setAlertaInicio('');
        }
    }, [mesCompra, anoCompra, mesInicio, anoInicio]);

    const mesFinalPreview = (() => {
        const { mesFinal, anoFinal } = calcularMesFinal(
            mesInicio,
            anoInicio,
            qtdParcelas
        );
        return `${MESES[mesFinal - 1]}/${anoFinal}`;
    })();

    async function handleSalvar() {
        setFeedback(null);

        if (!descricao.trim()) {
            setFeedback({ tipo: 'erro', msg: 'Descrição obrigatória.' });
            return;
        }

        const valorNumerico = parseFloat(valorParcela.replace(',', '.'));
        if (!valorParcela || valorNumerico <= 0) {
            setFeedback({ tipo: 'erro', msg: 'Valor inválido.' });
            return;
        }

        setCarregando(true);

        try {
            await apiPost('/api/compras', {
                usuarioId,
                cartao,
                descricao: descricao.trim(),
                mesCompra,
                anoCompra,
                mesInicio,
                anoInicio,
                qtdParcelas,
                valorParcela: valorNumerico,
            });

            setCarregando(false);
            setFeedback({ tipo: 'sucesso', msg: 'Compra cadastrada!' });
        } catch (err: any) {
            setCarregando(false);
            if (err instanceof Error) {
                setFeedback({ tipo: 'erro', msg: err.message });
            } else {
                const erroRede = AppError.rede();
                setFeedback({ tipo: 'erro', msg: erroRede.mensagemUsuario });
            }
        }
    }

    function limparFeedback() {
        const eraSucesso = feedback?.tipo === 'sucesso';
        setFeedback(null);

        if (eraSucesso) {
            setCartao('NUBANK');
            setDescricao('');
            setMesCompra(mesAtual);
            setAnoCompra(anoAtual);
            setMesInicio(mesAtual);
            setAnoInicio(anoAtual);
            setQtdParcelas(1);
            setValorParcela('');
            onSalvar();
            onFechar();
        }
    }

    return {
        cartao,
        setCartao,
        descricao,
        setDescricao,
        mesCompra,
        setMesCompra,
        anoCompra,
        setAnoCompra,
        mesInicio,
        setMesInicio,
        anoInicio,
        setAnoInicio,
        qtdParcelas,
        setQtdParcelas,
        valorParcela,
        setValorParcela,
        carregando,
        feedback,
        alertaInicio,
        alertaCompra,
        mesAtual,
        anoAtual,
        mesFinalPreview,
        handleSalvar,
        limparFeedback,
    };
}