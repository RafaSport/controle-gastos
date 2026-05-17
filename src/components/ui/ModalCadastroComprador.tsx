'use client';

import { apiPost } from '@/lib/api-client';
import { useState } from 'react';
import Botao from './Botao';
import Input from './Input';
import Modal from './Modal';
import { Toggle } from './Toggle';

interface Props {
    aberto: boolean;
    onFechar: () => void;
    onSalvar: () => void;
}

export default function ModalCadastroComprador({
    aberto,
    onFechar,
    onSalvar,
}: Props) {
    const [nome, setNome] = useState('');
    const [sobrenome, setSobrenome] = useState('');
    const [usaUber, setUsaUber] = useState(false);
    const [erro, setErro] = useState('');
    const [carregando, setCarregando] = useState(false);

    async function handleSalvar() {
        setErro('');

        if (!nome.trim() || !sobrenome.trim()) {
            setErro('Nome e sobrenome são obrigatórios.');
            return;
        }

        setCarregando(true);

        try {
            await apiPost('/api/usuarios', {
                nome: nome.trim(),
                sobrenome: sobrenome.trim(),
                usaUber,
            });

            setNome('');
            setSobrenome('');
            setUsaUber(false);
            onSalvar();
            onFechar();
        } catch (err: any) {
            setErro(
                err.message || 'Erro ao cadastrar comprador. Tente novamente.'
            );
        } finally {
            setCarregando(false);
        }
    }

    return (
        <Modal aberto={aberto} titulo="Novo Comprador" onFechar={onFechar}>
            <div className="flex flex-col gap-4">
                <Input
                    label="Nome"
                    placeholder="Ex: Ana"
                    value={nome}
                    onChange={(e) => setNome(e.target.value)}
                />

                <Input
                    label="Sobrenome"
                    placeholder="Ex: Bia"
                    value={sobrenome}
                    onChange={(e) => setSobrenome(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSalvar()}
                />

                <div className="flex items-center justify-between bg-zinc-800 rounded-lg px-3 py-2.5">
                    <div>
                        <p className="text-sm text-zinc-200">Usa Uber</p>
                        <p className="text-xs text-zinc-500">
                            Habilita controle de corridas
                        </p>
                    </div>
                    <Toggle value={usaUber} onChange={setUsaUber} />
                </div>

                {nome && sobrenome && (
                    <div className="bg-zinc-800 rounded-lg px-3 py-2">
                        <p className="text-xs text-zinc-400">
                            Login gerado automaticamente:
                            <span className="text-blue-400 font-medium ml-1">
                                {nome
                                    .toLowerCase()
                                    .normalize('NFD')
                                    .replace(/[\u0300-\u036f]/g, '')}
                                .{sobrenome.toLowerCase()}
                            </span>
                        </p>
                    </div>
                )}

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
                        Cadastrar
                    </Botao>
                </div>
            </div>
        </Modal>
    );
}