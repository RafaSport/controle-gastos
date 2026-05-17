// Hook compartilhado entre PaginaCompradorCliente e PaginaCompradorAdminCliente.
// Centraliza toda a lógica de busca de dados e cálculos financeiros mensais.

import { apiGet } from '@/lib/api-client';
import {
    calcularDividaAnterior,
    calcularTotalComprasNoMes,
    calcularTotalConsolidado,
    calcularTotalCorridas,
    encontrarPrimeiroMesEmAberto,
    gerarMesesDisponiveis,
} from '@/lib/utils';
import { Compra, Corrida, MesFechado, Usuario } from '@/types';
import { useEffect, useMemo, useState } from 'react';

// ============================================
// INTERFACE — Props do hook
// ============================================

interface UseResumoMensalProps {
    /** ID do usuário para buscar dados */
    usuarioId: string;
}

interface UseResumoMensalReturn {
    // Dados brutos
    usuario: Usuario | null;
    compras: Compra[];
    corridas: Corrida[];
    mesesFechados: MesFechado[];

    // Estados de UI
    carregando: boolean;
    carregandoUber: boolean;

    // Seleção de mês
    mesSelecionado: number;
    anoSelecionado: number;
    setMesSelecionado: (m: number) => void;
    setAnoSelecionado: (a: number) => void;

    // Dados derivados (calculados)
    mesEmAberto: number;
    anoEmAberto: number;
    mesesDisponiveis: { mes: number; ano: number; fechado: boolean }[];
    mesFechado: MesFechado | undefined;

    // Totais financeiros
    totalCompras: number;
    totalUber: number;
    dividaAnterior: number;
    totalConsolidado: number;

    // Ações
    recarregar: () => Promise<void>;
    recarregarCorridas: () => Promise<void>;
}

// ============================================
// HOOK PRINCIPAL
// ============================================

export function useResumoMensal({
    usuarioId,
}: UseResumoMensalProps): UseResumoMensalReturn {
    // ----------------------------------------
    // ESTADOS — Dados brutos do servidor
    // ----------------------------------------
    const [usuario, setUsuario] = useState<Usuario | null>(null);
    const [compras, setCompras] = useState<Compra[]>([]);
    const [corridas, setCorridas] = useState<Corrida[]>([]);
    const [mesesFechados, setMesesFechados] = useState<MesFechado[]>([]);

    // Estados de UI
    const [carregando, setCarregando] = useState(true);
    const [carregandoUber, setCarregandoUber] = useState(false);

    // Seleção de mês/ano
    const hoje = new Date();
    const [mesSelecionado, setMesSelecionado] = useState(hoje.getMonth() + 1);
    const [anoSelecionado, setAnoSelecionado] = useState(hoje.getFullYear());

    // ----------------------------------------
    // FUNÇÃO: Buscar dados principais (usuário, compras, meses)
    // ----------------------------------------
    async function buscarDados() {
        setCarregando(true);

        try {
            const [dadosUsuario, dadosCompras, dadosMeses] = await Promise.all([
                apiGet<Usuario | { erro: string }>(
                    `/api/usuarios?id=${usuarioId}`
                ),
                apiGet<Compra[]>(`/api/compras/usuario?id=${usuarioId}`),
                apiGet<MesFechado[]>(`/api/meses?id=${usuarioId}`),
            ]);

            // Validação: se a API retornar objeto de erro, trata como null
            setUsuario('id' in dadosUsuario ? dadosUsuario : null);
            setCompras(dadosCompras);
            setMesesFechados(dadosMeses);
        } catch (erro) {
            console.error('Erro ao buscar dados:', erro);
            // Em produção, aqui poderia disparar um toast de erro global
        } finally {
            setCarregando(false);
        }
    }

    // Busca inicial ao montar ou quando usuarioId muda
    useEffect(() => {
        buscarDados();
    }, [usuarioId]);

    // ----------------------------------------
    // FUNÇÃO: Buscar corridas Uber (só se usaUber = true)
    // ----------------------------------------
    async function buscarCorridas() {
        if (!usuario?.usaUber) return;
        setCarregandoUber(true);

        try {
            const data = await apiGet<Corrida[]>(
                `/api/corridas/usuario?id=${usuarioId}&mes=${mesSelecionado}&ano=${anoSelecionado}`
            );
            setCorridas(data);
        } catch (erro) {
            console.error('Erro ao buscar corridas:', erro);
        } finally {
            setCarregandoUber(false);
        }
    }

    // ----------------------------------------
    // FUNÇÃO PÚBLICA: Recarregar apenas corridas
    // ----------------------------------------
    async function recarregarCorridas() {
        await buscarCorridas();
    }

    // Busca corridas quando muda mês/ano ou quando descobre que usaUber
    useEffect(() => {
        buscarCorridas();
    }, [usuarioId, mesSelecionado, anoSelecionado]);

    // ----------------------------------------
    // DADOS DERIVADOS — Calculados com useMemo
    // ----------------------------------------

    // Mês em aberto (primeiro mês não fechado a partir de hoje)
    const { mes: mesEmAberto, ano: anoEmAberto } = useMemo(() => {
        const mesAtual = hoje.getMonth() + 1;
        const anoAtual = hoje.getFullYear();
        return encontrarPrimeiroMesEmAberto(mesesFechados, mesAtual, anoAtual);
    }, [mesesFechados, hoje]);

    // Inicializa seletor no mês em aberto quando carrega
    useEffect(() => {
        if (!carregando) {
            setMesSelecionado(mesEmAberto);
            setAnoSelecionado(anoEmAberto);
        }
    }, [carregando, mesEmAberto, anoEmAberto]);

    // Lista de meses para o seletor (2 histórico + 10 à frente)
    const mesesDisponiveis = useMemo(() => {
        return gerarMesesDisponiveis(mesesFechados, mesEmAberto, anoEmAberto);
    }, [mesesFechados, mesEmAberto, anoEmAberto]);

    // Mês fechado atual (se existir)
    const mesFechado = useMemo(() => {
        return mesesFechados.find(
            (mf) => mf.mes === mesSelecionado && mf.ano === anoSelecionado
        );
    }, [mesesFechados, mesSelecionado, anoSelecionado]);

    // Total de compras no mês selecionado
    const totalCompras = useMemo(() => {
        return calcularTotalComprasNoMes(
            compras,
            mesSelecionado,
            anoSelecionado
        );
    }, [compras, mesSelecionado, anoSelecionado]);

    // Total de corridas Uber no mês
    const totalUber = useMemo(() => {
        return calcularTotalCorridas(corridas);
    }, [corridas]);

    // Dívida anterior (do último mês fechado antes do atual)
    const dividaAnterior = useMemo(() => {
        return calcularDividaAnterior(
            mesesFechados,
            mesSelecionado,
            anoSelecionado
        );
    }, [mesesFechados, mesSelecionado, anoSelecionado]);

    // Total consolidado do mês
    const totalConsolidado = useMemo(() => {
        return calcularTotalConsolidado(
            totalCompras,
            totalUber,
            dividaAnterior
        );
    }, [totalCompras, totalUber, dividaAnterior]);

    // ----------------------------------------
    // RETORNO
    // ----------------------------------------
    return {
        usuario,
        compras,
        corridas,
        mesesFechados,
        carregando,
        carregandoUber,
        mesSelecionado,
        anoSelecionado,
        setMesSelecionado,
        setAnoSelecionado,
        mesEmAberto,
        anoEmAberto,
        mesesDisponiveis,
        mesFechado,
        totalCompras,
        totalUber,
        dividaAnterior,
        totalConsolidado,
        recarregar: buscarDados,
        recarregarCorridas,
    };
}