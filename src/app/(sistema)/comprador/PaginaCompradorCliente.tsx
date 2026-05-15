'use client';

import Header from '@/components/layout/Header';
import Badge from '@/components/ui/Badge';
import CardDividaAnterior from '@/components/ui/CardDividaAnterior';
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

    useEffect(() => {
        async function buscarDados() {
            try {
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
            } catch (erro) {
                console.error('Erro ao buscar dados:', erro);
            } finally {
                setCarregando(false);
            }
        }

        buscarDados();
    }, [usuarioId]);

    useEffect(() => {
        if (!usuario?.usaUber) return;

        async function buscarCorridas() {
            try {
                setCarregandoUber(true);

                const res = await fetch(
                    `/api/corridas/usuario?id=${usuarioId}&mes=${mesSelecionado}&ano=${anoSelecionado}`
                );

                const data = await res.json();

                setCorridas(Array.isArray(data) ? data : []);
            } catch (erro) {
                console.error('Erro ao buscar corridas:', erro);
            } finally {
                setCarregandoUber(false);
            }
        }

        buscarCorridas();
    }, [usuario, usuarioId, mesSelecionado, anoSelecionado]);

    const { mesEmAberto, anoEmAberto } = useMemo(() => {
        const mesReal = hoje.getMonth() + 1;
        const anoReal = hoje.getFullYear();

        let m = mesReal;
        let a = anoReal;

        while (mesesFechados.some((mf) => mf.mes === m && mf.ano === a)) {
            m = m === 12 ? 1 : m + 1;

            if (m === 1) {
                a++;
            }
        }

        return {
            mesEmAberto: m,
            anoEmAberto: a,
        };
    }, [mesesFechados]);

    useEffect(() => {
        if (!carregando) {
            setMesSelecionado(mesEmAberto);
            setAnoSelecionado(anoEmAberto);
        }
    }, [carregando, mesEmAberto, anoEmAberto]);

    const mesesDisponiveis = useMemo(() => {
        const lista = [];

        for (let i = -3; i <= 9; i++) {
            const data = new Date(hoje.getFullYear(), hoje.getMonth() + i, 1);

            const m = data.getMonth() + 1;
            const a = data.getFullYear();

            const fechado = mesesFechados.some(
                (mf) => mf.mes === m && mf.ano === a
            );

            lista.push({
                mes: m,
                ano: a,
                fechado,
            });
        }

        return lista;
    }, [mesesFechados]);

    const mesFechado = mesesFechados.find(
        (mf) => mf.mes === mesSelecionado && mf.ano === anoSelecionado
    );

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

    const totalUber = corridas.reduce((acc, c) => acc + c.valor, 0);

    const ultimoMesFechado = mesesFechados
        .filter(
            (mf) => mf.ano * 12 + mf.mes < anoSelecionado * 12 + mesSelecionado
        )
        .sort((a, b) => b.ano * 12 + b.mes - (a.ano * 12 + a.mes))[0];

    const totalDivida = ultimoMesFechado
        ? Math.max(0, ultimoMesFechado.totalDoMes - ultimoMesFechado.totalPago)
        : 0;

    const totalMes = totalCompras + totalUber + totalDivida;

    if (carregando) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-zinc-950">
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
                    mesAtual={mesEmAberto}
                    anoAtual={anoEmAberto}
                    mesesDisponiveis={mesesDisponiveis}
                    onChange={(mes, ano) => {
                        setMesSelecionado(mes);
                        setAnoSelecionado(ano);
                    }}
                />

                {usuario?.usaUber && (
                    <CardUber
                        usuarioId={usuarioId}
                        mes={mesSelecionado}
                        ano={anoSelecionado}
                        corridas={corridas}
                        carregando={carregandoUber}
                    />
                )}

                <CardDividaAnterior
                    mesesFechados={mesesFechados}
                    mesSelecionado={mesSelecionado}
                    anoSelecionado={anoSelecionado}
                />

                <TabelaCompras
                    compras={compras}
                    mesSelecionado={mesSelecionado}
                    anoSelecionado={anoSelecionado}
                />

                <div className="bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 flex flex-col gap-2">
                    <div className="flex items-center justify-between">
                        <Badge status={mesFechado ? 'finalizado' : 'aberto'} />

                        {mesFechado && (
                            <span className="text-xs text-zinc-500">
                                Pago: R${' '}
                                {mesFechado.totalPago
                                    .toFixed(2)
                                    .replace('.', ',')}
                            </span>
                        )}
                    </div>

                    <div className="border-t border-zinc-800 pt-2 flex flex-col gap-1">
                        <div className="flex justify-between text-xs text-zinc-500">
                            <span>Compras</span>

                            <span>
                                R$ {totalCompras.toFixed(2).replace('.', ',')}
                            </span>
                        </div>

                        {totalUber > 0 && (
                            <div className="flex justify-between text-xs text-zinc-500">
                                <span>Uber</span>

                                <span>
                                    R$ {totalUber.toFixed(2).replace('.', ',')}
                                </span>
                            </div>
                        )}

                        {totalDivida > 0 && (
                            <div className="flex justify-between text-xs text-red-400">
                                <span>Dívida anterior</span>

                                <span>
                                    R${' '}
                                    {totalDivida.toFixed(2).replace('.', ',')}
                                </span>
                            </div>
                        )}

                        <div className="flex justify-between text-sm font-bold text-zinc-100 border-t border-zinc-800 pt-1 mt-1">
                            <span>Total do mês</span>

                            <span>
                                R$ {totalMes.toFixed(2).replace('.', ',')}
                            </span>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}