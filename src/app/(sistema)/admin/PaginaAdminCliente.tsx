'use client';

import Header from '@/components/layout/Header';
import Botao from '@/components/ui/Botao';
import ModalCadastroComprador from '@/components/ui/ModalCadastroComprador';
import ModalEditarComprador from '@/components/ui/ModalEditarComprador';
import { Trash2 } from 'lucide-react';
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
    const [modalCadastro, setModalCadastro] = useState(false);
    const [modalEditar, setModalEditar] = useState(false);
    const [compradorEditando, setCompradorEditando] =
        useState<Comprador | null>(null);

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

    async function handleExcluir(e: React.MouseEvent, id: string) {
        // Impede que o clique na linha navegue para a tela do comprador
        e.stopPropagation();
        if (!confirm('Excluir este comprador e todas as suas compras?')) return;
        await fetch(`/api/usuarios/${id}`, { method: 'DELETE' });
        buscarCompradores();
    }

    function handleEditar(e: React.MouseEvent, comprador: Comprador) {
        e.stopPropagation();
        setCompradorEditando(comprador);
        setModalEditar(true);
    }

    return (
        <div className="min-h-screen bg-zinc-950">
            <Header nomeUsuario="Admin" />

            <main className="max-w-4xl mx-auto px-4 py-6 flex flex-col gap-4">
                <div className="flex items-center justify-between">
                    <h1 className="text-lg font-semibold text-zinc-100">
                        Compradores
                    </h1>
                    <Botao
                        cor="verde"
                        tamanho="sm"
                        onClick={() => setModalCadastro(true)}
                    >
                        + Novo Comprador
                    </Botao>
                </div>

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
                                    <th className="px-3 py-3 text-center">
                                        Ações
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {compradores.map((c, index) => (
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
                                        <td className="px-3 py-3">
                                            <div className="flex gap-1 justify-center">
                                                <Botao
                                                    cor="amarelo"
                                                    tamanho="sm"
                                                    onClick={(e) =>
                                                        handleEditar(e, c)
                                                    }
                                                >
                                                    Editar
                                                </Botao>
                                                <Botao
                                                    cor="vermelho"
                                                    tamanho="sm"
                                                    icone={<Trash2 size={14} />}
                                                    onClick={(e) =>
                                                        handleExcluir(e, c.id)
                                                    }
                                                />
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </main>

            <ModalCadastroComprador
                aberto={modalCadastro}
                onFechar={() => setModalCadastro(false)}
                onSalvar={buscarCompradores}
            />

            <ModalEditarComprador
                aberto={modalEditar}
                comprador={compradorEditando}
                onFechar={() => {
                    setModalEditar(false);
                    setCompradorEditando(null);
                }}
                onSalvar={buscarCompradores}
            />
        </div>
    );
}
