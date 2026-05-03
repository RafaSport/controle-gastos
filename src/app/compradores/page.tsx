'use client';

import { ModalComprador } from '@/components/compradores/ModalComprador';
import { MainLayout } from '@/components/layout/MainLayout';
import { useEffect, useMemo, useState } from 'react';

type Comprador = {
    id: number;
    nome: string;
    parcelas: number;
    valor: number;
};

export default function CompradoresPage() {
    const [compradores, setCompradores] = useState<Comprador[]>([]);
    const [modalAberto, setModalAberto] = useState(false);
    const [nome, setNome] = useState('');
    const [editandoId, setEditandoId] = useState<number | null>(null);
    const [busca, setBusca] = useState('');

    useEffect(() => {
        const dados = localStorage.getItem('compradores');

        if (dados) {
            setCompradores(JSON.parse(dados));
        }
    }, []);

    useEffect(() => {
        localStorage.setItem('compradores', JSON.stringify(compradores));
    }, [compradores]);

    function salvarComprador() {
        if (!nome.trim()) return;

        if (editandoId) {
            const listaAtualizada = compradores.map((item) =>
                item.id === editandoId ? { ...item, nome } : item
            );

            setCompradores(listaAtualizada);
        } else {
            const novo = {
                id: Date.now(),
                nome,
                parcelas: 0,
                valor: 0,
            };

            setCompradores([...compradores, novo]);
        }

        setNome('');
        setEditandoId(null);
        setModalAberto(false);
    }

    function editarComprador(id: number) {
        const comprador = compradores.find((item) => item.id === id);

        if (!comprador) return;

        setNome(comprador.nome);
        setEditandoId(id);
        setModalAberto(true);
    }

    function excluirComprador(id: number) {
        const confirmar = confirm('Deseja excluir este comprador?');

        if (!confirmar) return;

        const novaLista = compradores.filter((item) => item.id !== id);

        setCompradores(novaLista);
    }

    const compradoresFiltrados = useMemo(() => {
        return compradores.filter((item) =>
            item.nome.toLowerCase().includes(busca.toLowerCase())
        );
    }, [compradores, busca]);

    return (
        <MainLayout>
            <div className="space-y-4">
                {/* Topo */}
                <div className="space-y-3">
                    <div className="flex items-center justify-between">
                        <h1 className="text-2xl font-bold text-gray-800">
                            Compradores
                        </h1>

                        <button
                            onClick={() => {
                                setEditandoId(null);
                                setNome('');
                                setModalAberto(true);
                            }}
                            className="bg-gray-800 text-white px-4 h-10 rounded-xl"
                        >
                            Novo
                        </button>
                    </div>

                    <div className="bg-white rounded-2xl shadow-sm p-4 space-y-3">
                        <input
                            value={busca}
                            onChange={(e) => setBusca(e.target.value)}
                            placeholder="Buscar comprador..."
                            className="w-full h-12 px-4 border rounded-xl"
                        />

                        <p className="text-sm text-gray-500">
                            Total de compradores: {compradores.length}
                        </p>
                    </div>
                </div>

                {/* Lista */}
                <div className="space-y-3">
                    {compradoresFiltrados.length === 0 && (
                        <div className="bg-white rounded-2xl p-6 text-center text-gray-500">
                            Nenhum comprador encontrado.
                        </div>
                    )}

                    {compradoresFiltrados.map((item) => (
                        <div
                            key={item.id}
                            className="bg-white rounded-2xl shadow-sm p-4"
                        >
                            <h2 className="font-semibold text-lg">
                                {item.nome}
                            </h2>

                            <p className="text-sm text-gray-500">
                                Parcelas ativas: {item.parcelas}
                            </p>

                            <p className="text-sm text-gray-500">
                                Total mês: R$ {item.valor}
                            </p>

                            <div className="flex gap-2 mt-3">
                                <button
                                    onClick={() => editarComprador(item.id)}
                                    className="px-3 h-9 rounded-xl border text-sm"
                                >
                                    Editar
                                </button>

                                <button
                                    onClick={() => excluirComprador(item.id)}
                                    className="px-3 h-9 rounded-xl bg-red-500 text-white text-sm"
                                >
                                    Excluir
                                </button>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Modal */}
                <ModalComprador
                    aberto={modalAberto}
                    nome={nome}
                    setNome={setNome}
                    editandoId={editandoId}
                    onClose={() => {
                        setModalAberto(false);
                        setEditandoId(null);
                        setNome('');
                    }}
                    onSalvar={salvarComprador}
                />
            </div>
        </MainLayout>
    );
}
