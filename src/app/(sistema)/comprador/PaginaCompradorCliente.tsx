'use client';

import Header from '@/components/layout/Header';
import Badge from '@/components/ui/Badge';
import CardUber from '@/components/ui/CardUber';
import SeletorMes from '@/components/ui/SeletorMes';
import TabelaCompras from '@/components/ui/TabelaCompras';
import { Compra, Corrida, MesFechado, Usuario } from '@/types';
import { useEffect, useMemo, useState } from 'react';

interface Props {
    usuarioId: string;
    nomeUsuario: string;
}

export default function PaginaCompradorCliente({
    usuarioId,
    nomeUsuario,
}: Props) {
    const hoje = new Date();

    const [usuario, setUsuario] = useState<Usuario | null>(null);
    const [compras, setCompras] = useState<Compra[]>([]);
    const [corridas, setCorridas] = useState<Corrida[]>([]);
    const [mesesFechados, setMesesFechados] = useState<MesFechado[]>([]);
    const [mesSelecionado, setMesSelecionado] = useState(hoje.getMonth() + 1);
    const [anoSelecionado, setAnoSelecionado] = useState(hoje.getFullYear());
    const [carregando, setCarregando] = useState(true);
    const [carregandoUber, setCarregandoUber] = useState(false);

    // Busca dados principais ao montar
    useEffect(() => {
        async function buscarDados() {
            const [resUsuario, resCompras, resMeses] = await Promise.all([
                fetch(`/api/usuarios?id=${usuarioId}`),
                fetch(`/api/compras/usuario?id=${usuarioId}`),
                fetch(`/api/meses?id=${usuarioId}`),
            ]);

            const dadosUsuario = await resUsuario.json();
            const dadosCompras = await resCompras.json();
            const dadosMeses = await resMeses.json();

            setUsuario(dadosUsuario?.id ? dadosUsuario : null);
            setCompras(Array.isArray(dadosCompras) ? dadosCompras : []);
            setMesesFechados(Array.isArray(dadosMeses) ? dadosMeses : []);
            setCarregando(false);
        }
        buscarDados();
    }, [usuarioId]);

    // Busca corridas sempre que o mês/ano mudar e o usuário usar Uber
    useEffect(() => {
        if (!usuario?.usaUber) return;

        async function buscarCorridas() {
            setCarregandoUber(true);
            const res = await fetch(
                `/api/corridas/usuario?id=${usuarioId}&mes=${mesSelecionado}&ano=${anoSelecionado}`
            );
            const data = await res.json();
            setCorridas(Array.isArray(data) ? data : []);
            setCarregandoUber(false);
        }
        buscarCorridas();
    }, [usuario, mesSelecionado, anoSelecionado]);

    const mesesDisponiveis = useMemo(() => {
        const lista = [];
        for (let i = -3; i <= 9; i++) {
            const data = new Date(hoje.getFullYear(), hoje.getMonth() + i, 1);
            const m = data.getMonth() + 1;
            const a = data.getFullYear();
            const fechado = mesesFechados.some(
                (mf) => mf.mes === m && mf.ano === a
            );
            lista.push({ mes: m, ano: a, fechado });
        }
        return lista;
    }, [mesesFechados]);

    const mesFechado = mesesFechados.some(
        (mf) => mf.mes === mesSelecionado && mf.ano === anoSelecionado
    );

    // Total das compras do mês
    const totalCompras = useMemo(() => {
        return compras
            .filter((c) => {
                const ini = c.anoInicio * 12 + c.mesInicio;
                const fim = c.anoFinal * 12 + c.mesFinal;
                const sel = anoSelecionado * 12 + mesSelecionado;
                return ini <= sel && fim >= sel;
            })
            .reduce((acc, c) => acc + c.valorParcela, 0);
    }, [compras, mesSelecionado, anoSelecionado]);

    // Total do Uber do mês
    const totalUber = corridas.reduce((acc, c) => acc + c.valor, 0);

    // Total geral = compras + uber
    const totalMes = totalCompras + totalUber;

    const dividaAnterior = useMemo(() => {
        const mes = mesesFechados.find(
            (mf) => mf.mes === mesSelecionado && mf.ano === anoSelecionado
        );
        return mes?.dividaAnterior ?? 0;
    }, [mesesFechados, mesSelecionado, anoSelecionado]);

    if (carregando) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <span className="text-zinc-500 text-sm">Carregando...</span>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-zinc-950">
            <Header nomeUsuario={nomeUsuario} />

            <main className="max-w-4xl mx-auto px-4 py-6 flex flex-col gap-4">
                <SeletorMes
                    mesSelecionado={mesSelecionado}
                    anoSelecionado={anoSelecionado}
                    mesAtual={hoje.getMonth() + 1}
                    anoAtual={hoje.getFullYear()}
                    mesesDisponiveis={mesesDisponiveis}
                    onChange={(mes, ano) => {
                        setMesSelecionado(mes);
                        setAnoSelecionado(ano);
                    }}
                />

                {/* Card do Uber — só aparece se o comprador usar Uber */}
                {usuario?.usaUber && (
                    <CardUber
                        usuarioId={usuarioId}
                        mes={mesSelecionado}
                        ano={anoSelecionado}
                        corridas={corridas}
                        carregando={carregandoUber}
                    />
                )}

                <TabelaCompras
                    compras={compras}
                    mesSelecionado={mesSelecionado}
                    anoSelecionado={anoSelecionado}
                />

                {/* Rodapé com totais e status */}
                <div className="flex items-center justify-between bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3">
                    <Badge status={mesFechado ? 'finalizado' : 'aberto'} />

                    {dividaAnterior > 0 && (
                        <div className="text-center">
                            <p className="text-xs text-zinc-500">
                                Dívida anterior
                            </p>
                            <p className="text-sm font-medium text-red-400">
                                R$ {dividaAnterior.toFixed(2).replace('.', ',')}
                            </p>
                        </div>
                    )}

                    <div className="text-right">
                        <p className="text-xs text-zinc-500">Total do mês</p>
                        <p className="text-base font-bold text-zinc-100">
                            R$ {totalMes.toFixed(2).replace('.', ',')}
                        </p>
                    </div>
                </div>
            </main>
        </div>
    );
}