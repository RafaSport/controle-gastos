'use client';

import Header from '@/components/layout/Header';
import Botao from '@/components/ui/Botao';
import ModalCadastroComprador from '@/components/ui/ModalCadastroComprador';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

interface Comprador {
    id: string;
    nome: string;
    sobrenome: string;
    login: string;
    usaUber: boolean;
    qtdCompras: number;
    totalAPagar: number;
}

export default function PaginaAdminCliente() {
    const router = useRouter();

    const [compradores, setCompradores] = useState<Comprador[]>([]);
    const [carregando, setCarregando] = useState(true);
    const [modalAberto, setModalAberto] = useState(false);

    async function buscarCompradores() {
        setCarregando(true);
        const res = await fetch('/api/usuarios');
        const data = await res.json();
        setCompradores(Array.isArray(data) ? data : []);
        setCarregando(false);
    }

    useEffect(() => {
        buscarCompradores();
    }, []);

    return (
        <div className="min-h-screen bg-zinc-950">
            <Header nomeUsuario="Admin" />

            <main className="max-w-4xl mx-auto px-4 py-6 flex flex-col gap-4">
                {/* Cabeçalho com título e botão de cadastro */}
                <div className="flex items-center justify-between">
                    <h1 className="text-lg font-semibold text-zinc-100">
                        Compradores
                    </h1>
                    <Botao
                        cor="verde"
                        tamanho="sm"
                        onClick={() => setModalAberto(true)}
                    >
                        + Novo Comprador
                    </Botao>
                </div>

                {/* Tabela de compradores */}
                {carregando ? (
                    <div className="text-center py-12 text-zinc-500 text-sm">
                        Carregando...
                    </div>
                ) : compradores.length === 0 ? (
                    <div className="text-center py-12 text-zinc-500 text-sm">
                        Nenhum comprador cadastrado.
                    </div>
                ) : (
                    <div className="w-full overflow-x-auto rounded-lg border border-zinc-800">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="bg-zinc-800 text-zinc-400 text-xs uppercase tracking-wide">
                                    <th className="px-3 py-3 text-left">
                                        Nome
                                    </th>
                                    <th className="px-3 py-3 text-center">
                                        Compras
                                    </th>
                                    <th className="px-3 py-3 text-center">
                                        Uber
                                    </th>
                                    <th className="px-3 py-3 text-right">
                                        Total a pagar
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {compradores.map((c, index) => (
                                    // Linha clicável — vai para a tela do comprador
                                    <tr
                                        key={c.id}
                                        onClick={() =>
                                            router.push(
                                                `/admin/comprador/${c.id}`
                                            )
                                        }
                                        className={`
                                            cursor-pointer transition-colors duration-100
                                            hover:bg-blue-500/10
                                            ${index % 2 === 0 ? 'bg-zinc-900' : 'bg-zinc-800'}
                                        `}
                                    >
                                        <td className="px-3 py-3">
                                            <p className="font-medium text-zinc-100">
                                                {c.nome} {c.sobrenome}
                                            </p>
                                            <p className="text-xs text-zinc-500">
                                                {c.login}
                                            </p>
                                        </td>
                                        <td className="px-3 py-3 text-center text-zinc-400">
                                            {c.qtdCompras}
                                        </td>
                                        <td className="px-3 py-3 text-center">
                                            {c.usaUber ? (
                                                <span className="text-xs font-medium text-blue-400">
                                                    Sim
                                                </span>
                                            ) : (
                                                <span className="text-xs text-zinc-600">
                                                    —
                                                </span>
                                            )}
                                        </td>
                                        <td className="px-3 py-3 text-right font-medium text-zinc-100">
                                            R${' '}
                                            {c.totalAPagar
                                                .toFixed(2)
                                                .replace('.', ',')}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </main>

            {/* Modal de cadastro de comprador */}
            <ModalCadastroComprador
                aberto={modalAberto}
                onFechar={() => setModalAberto(false)}
                onSalvar={buscarCompradores}
            />
        </div>
    );
}