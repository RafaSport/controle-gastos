/**  Hook que encapsula toda a lógica de estado, validação
 * e submitdo formulário de cadastro de compra.
 * Separa a "cabeça" da "tela".
 */

import { AppError, extrairErroApi } from '@/lib/errors';
import { calcularMesFinal } from '@/lib/utils';
import { Cartao } from '@/types';
import { useEffect, useState } from 'react';

// ============================================
// INTERFACE — O que o hook recebe e retorna
// ============================================

interface UseCadastroCompraProps {
    /** ID do usuário que está fazendo a compra */
    usuarioId: string;
    /** Se o modal está aberto (controla reset do formulário) */
    aberto: boolean;
    /** Callback chamado após salvar com sucesso */
    onSalvar: () => void;
    /** Callback para fechar o modal */
    onFechar: () => void;
}

interface UseCadastroCompraReturn {
    // Estados do formulário (para bindar nos inputs)
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

    // Estados de UI (erros, alertas, loading)
    erro: string;
    alertaInicio: string;
    alertaCompra: string;
    carregando: boolean;

    // Dados derivados (calculados)
    mesAtual: number;
    anoAtual: number;
    mesFinalPreview: string;

    // Ações
    handleSalvar: () => Promise<void>;
}

// ============================================
// CONSTANTES — Reutilizadas no hook e no componente
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
// FUNÇÃO AUXILIAR — Converte mês/ano para índice
// ============================================

function emMeses(mes: number, ano: number): number {
    return ano * 12 + mes;
}

// ============================================
// HOOK PRINCIPAL
// ============================================

export function useCadastroCompra({
    usuarioId,
    aberto,
    onSalvar,
    onFechar,
}: UseCadastroCompraProps): UseCadastroCompraReturn {
    // ----------------------------------------
    // DATA ATUAL (referência para validações)
    // ----------------------------------------
    const hoje = new Date();
    const mesAtual = hoje.getMonth() + 1;
    const anoAtual = hoje.getFullYear();

    // ----------------------------------------
    // ESTADOS DO FORMULÁRIO
    // ----------------------------------------
    const [cartao, setCartao] = useState<Cartao>('NUBANK');
    const [descricao, setDescricao] = useState('');
    const [mesCompra, setMesCompra] = useState(mesAtual);
    const [anoCompra, setAnoCompra] = useState(anoAtual);
    const [mesInicio, setMesInicio] = useState(mesAtual);
    const [anoInicio, setAnoInicio] = useState(anoAtual);
    const [qtdParcelas, setQtdParcelas] = useState(1);
    const [valorParcela, setValorParcela] = useState('');

    // Estados de UI
    const [erro, setErro] = useState('');
    const [alertaInicio, setAlertaInicio] = useState('');
    const [alertaCompra, setAlertaCompra] = useState('');
    const [carregando, setCarregando] = useState(false);

    // ----------------------------------------
    // EFEITO 1: Reseta formulário quando o modal abre
    // ----------------------------------------
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
            setAlertaInicio('');
            setAlertaCompra('');
        }
    }, [aberto]);

    // ----------------------------------------
    // EFEITO 2: Valida mês da compra
    // Regra: não pode ser futuro. Alerta se 3+ meses atrás.
    // ----------------------------------------
    useEffect(() => {
        const compraEmMeses = emMeses(mesCompra, anoCompra);
        const atualEmMeses = emMeses(mesAtual, anoAtual);
        const diferencaMeses = atualEmMeses - compraEmMeses;

        // Se tentou colocar no futuro, corrige para o mês atual
        if (compraEmMeses > atualEmMeses) {
            setMesCompra(mesAtual);
            setAnoCompra(anoAtual);
            setAlertaCompra('');
            return;
        }

        // Alerta se a compra foi há 3+ meses
        if (diferencaMeses >= 3) {
            setAlertaCompra(
                `Esta compra foi há ${diferencaMeses} meses (${MESES[mesCompra - 1]}/${anoCompra}). Isso está certo?`
            );
        } else {
            setAlertaCompra('');
        }
    }, [mesCompra, anoCompra, mesAtual, anoAtual]);

    // ----------------------------------------
    // EFEITO 3: Valida mês de início
    // Regra: nunca antes da compra. Alerta se 3+ meses depois.
    // ----------------------------------------
    useEffect(() => {
        const compraEmMeses = emMeses(mesCompra, anoCompra);
        const inicioEmMeses = emMeses(mesInicio, anoInicio);
        const diferencaMeses = inicioEmMeses - compraEmMeses;

        // Se início é antes da compra, corrige para igualar
        if (inicioEmMeses < compraEmMeses) {
            setMesInicio(mesCompra);
            setAnoInicio(anoCompra);
            setAlertaInicio('');
            return;
        }

        // Alerta se o início é 3+ meses depois da compra
        if (diferencaMeses >= 3) {
            setAlertaInicio(
                `O pagamento só começa em ${MESES[mesInicio - 1]}/${anoInicio}, que é ${diferencaMeses} meses depois da compra. Isso está certo?`
            );
        } else {
            setAlertaInicio('');
        }
    }, [mesCompra, anoCompra, mesInicio, anoInicio]);

    // ----------------------------------------
    // DADO DERIVADO: Preview do mês final
    // ----------------------------------------
    const mesFinalPreview = (() => {
        const { mesFinal, anoFinal } = calcularMesFinal(
            mesInicio,
            anoInicio,
            qtdParcelas
        );
        return `${MESES[mesFinal - 1]}/${anoFinal}`;
    })();

    // ----------------------------------------
    // AÇÃO: Salvar compra
    // ----------------------------------------
    async function handleSalvar() {
        setErro('');

        // Validação 1: descrição obrigatória
        if (!descricao.trim()) {
            setErro('Descrição obrigatória.');
            return;
        }

        // Validação 2: valor deve ser > 0
        const valorNumerico = parseFloat(valorParcela.replace(',', '.'));
        if (!valorParcela || valorNumerico <= 0) {
            setErro('Valor inválido.');
            return;
        }

        setCarregando(true);

        try {
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
                    valorParcela: valorNumerico,
                }),
            });

            if (!res.ok) {
                const erroApi = await extrairErroApi(res);
                setErro(erroApi.mensagemUsuario);
                return;
            }

            onSalvar(); // Notifica pai que salvou
            onFechar(); // Fecha modal
        } catch {
            const erroRede = AppError.rede();
            setErro(erroRede.mensagemUsuario);
        } finally {
            setCarregando(false);
        }
    }

    // ----------------------------------------
    // RETORNO: Tudo que o componente precisa
    // ----------------------------------------
    return {
        // Estados
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

        // UI
        erro,
        alertaInicio,
        alertaCompra,
        carregando,

        // Derivados
        mesAtual,
        anoAtual,
        mesFinalPreview,

        // Ações
        handleSalvar,
    };
}
