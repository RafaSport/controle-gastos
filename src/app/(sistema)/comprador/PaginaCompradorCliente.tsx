'use client'

import Header from '@/components/layout/Header'
import Badge from '@/components/ui/Badge'
import SeletorMes from '@/components/ui/SeletorMes'
import TabelaCompras from '@/components/ui/TabelaCompras'
import { Compra, MesFechado } from '@/types'
import { useEffect, useMemo, useState } from 'react'

interface Props {
    usuarioId: string
    nomeUsuario: string
}

export default function PaginaCompradorCliente({ usuarioId, nomeUsuario }: Props) {
    const hoje = new Date()

    const [compras, setCompras]               = useState<Compra[]>([])
    const [mesesFechados, setMesesFechados]   = useState<MesFechado[]>([])
    const [mesSelecionado, setMesSelecionado] = useState(hoje.getMonth() + 1)
    const [anoSelecionado, setAnoSelecionado] = useState(hoje.getFullYear())
    const [carregando, setCarregando]         = useState(true)

    useEffect(() => {
        async function buscarDados() {
            const [resCompras, resMeses] = await Promise.all([
                fetch(`/api/compras/usuario/${usuarioId}`),
                fetch(`/api/meses/${usuarioId}`),
            ])
            setCompras(await resCompras.json())
            setMesesFechados(await resMeses.json())
            setCarregando(false)
        }
        buscarDados()
    }, [usuarioId])

    // Mês atual é sempre o 4º — 3 meses antes e 9 meses depois
    const mesesDisponiveis = useMemo(() => {
        const lista = []
        for (let i = -3; i <= 9; i++) {
            const data    = new Date(hoje.getFullYear(), hoje.getMonth() + i, 1)
            const m       = data.getMonth() + 1
            const a       = data.getFullYear()
            const fechado = mesesFechados.some((mf) => mf.mes === m && mf.ano === a)
            lista.push({ mes: m, ano: a, fechado })
        }
        return lista
    }, [mesesFechados])

    const mesFechado = mesesFechados.some(
        (mf) => mf.mes === mesSelecionado && mf.ano === anoSelecionado
    )

    const totalMes = useMemo(() => {
        return compras
            .filter((c) => {
                const ini = c.anoInicio * 12 + c.mesInicio
                const fim = c.anoFinal  * 12 + c.mesFinal
                const sel = anoSelecionado * 12 + mesSelecionado
                return ini <= sel && fim >= sel
            })
            .reduce((acc, c) => acc + c.valorParcela, 0)
    }, [compras, mesSelecionado, anoSelecionado])

    const dividaAnterior = useMemo(() => {
        const mes = mesesFechados.find(
            (mf) => mf.mes === mesSelecionado && mf.ano === anoSelecionado
        )
        return mes?.dividaAnterior ?? 0
    }, [mesesFechados, mesSelecionado, anoSelecionado])

    if (carregando) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <span className="text-zinc-500 text-sm">Carregando...</span>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-zinc-950">
            <Header nomeUsuario={nomeUsuario} />

            <main className="max-w-4xl mx-auto px-4 py-6 flex flex-col gap-4">

                {/* Seletor e tabela compartilham a mesma largura máxima */}
                <SeletorMes
                    mesSelecionado={mesSelecionado}
                    anoSelecionado={anoSelecionado}
                    mesAtual={hoje.getMonth() + 1}
                    anoAtual={hoje.getFullYear()}
                    mesesDisponiveis={mesesDisponiveis}
                    onChange={(mes, ano) => {
                        setMesSelecionado(mes)
                        setAnoSelecionado(ano)
                    }}
                />

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
                            <p className="text-xs text-zinc-500">Dívida anterior</p>
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
    )
}