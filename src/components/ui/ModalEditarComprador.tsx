'use client';

import { apiPut, apiPatch } from '@/lib/api-client';
import { useEffect, useState } from 'react';
import Botao from './Botao';
import Input from './Input';
import Modal from './Modal';
import { Toggle } from './Toggle';

interface Comprador {
    id: string;
    nome: string;
    sobrenome: string;
    login: string;
    usaUber: boolean;
}

interface Props {
    aberto: boolean;
    comprador: Comprador | null;
    onFechar: () => void;
    onSalvar: () => void;
}

export default function ModalEditarComprador({
    aberto,
    comprador,
    onFechar,
    onSalvar,
}: Props) {
    const [nome, setNome] = useState('');
    const [sobrenome, setSobrenome] = useState('');
    const [usaUber, setUsaUber] = useState(false);
    const [erro, setErro] = useState('');
    const [carregando, setCarregando] = useState(false);
    const [resetando, setResetando] = useState(false);
    const [resetOk, setResetOk] = useState(false);

    useEffect(() => {
        if (comprador) {
            setNome(comprador.nome);
            setSobrenome(comprador.sobrenome);
            setUsaUber(comprador.usaUber);
            setErro('');
            setResetOk(false);
        }
    }, [comprador]);

    async function handleSalvar() {
        setErro('');
        if (!nome.trim() || !sobrenome.trim()) {
            setErro('Nome e sobrenome são obrigatórios.');
            return;
        }

        setCarregando(true);

        try {
            await apiPut(`/api/usuarios/${comprador?.id}`, {
                nome: nome.trim(),
                sobrenome: sobrenome.trim(),
                usaUber,
            });

            onSalvar();
            onFechar();
        } catch (err: any) {
            setErro(err.message || 'Erro ao atualizar comprador.');
        } finally {
            setCarregando(false);
        }
    }

    async function handleResetarSenha() {
        if (
            !confirm(
                `Resetar a senha de ${comprador?.nome}? A senha voltará para "${comprador?.login}123".`
            )
        )
            return;

        setResetando(true);

        try {
            await apiPatch('/api/auth/alterar-senha', { id: comprador?.id });

            setResetOk(true);
            setTimeout(() => setResetOk(false), 3000);
        } catch (err: any) {
            setErro(err.message || 'Erro ao resetar senha.');
        } finally {
            setResetando(false);
        }
    }

    return (
        <Modal aberto={aberto} titulo="Editar Comprador" onFechar={onFechar}>
            <div className="flex flex-col gap-4">
                <Input
                    label="Nome"
                    value={nome}
                    onChange={(e) => setNome(e.target.value)}
                />

                <Input
                    label="Sobrenome"
                    value={sobrenome}
                    onChange={(e) => setSobrenome(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSalvar()}
                />

                <div className="flex items-center justify-between bg-zinc-800 rounded-lg px-3 py-2.5">
                    <div>
                        <p className="text-sm text-zinc-200">Usa Uber</p>
                        <p className="text-xs text-zinc-500">Habilita controle de corridas</p>
                    </div>
                    <Toggle value={usaUber} onChange={setUsaUber} />
                </div>

                <div className="bg-zinc-800 rounded-lg px-3 py-2">
                    <p className="text-xs text-zinc-500">
                        ⚠ O login não é alterado ao editar o nome.
                    </p>
                </div>

                <div className="flex items-center justify-between bg-zinc-800 rounded-lg px-3 py-2.5">
                    <div>
                        <p className="text-sm text-zinc-200">Senha esquecida?</p>
                        <p className="text-xs text-zinc-500">
                            Reseta para{' '}
                            <span className="text-zinc-400 font-medium">{comprador?.login}123</span>
                        </p>
                    </div>
                    {resetOk ? (
                        <span className="text-xs text-green-400 font-medium">✓ Resetada!</span>
                    ) : (
                        <Botao
                            cor="cinza"
                            tamanho="sm"
                            carregando={resetando}
                            onClick={handleResetarSenha}
                        >
                            Resetar
                        </Botao>
                    )}
                </div>

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
                    <Botao cor="verde" carregando={carregando} onClick={handleSalvar}>
                        Salvar
                    </Botao>
                </div>
            </div>
        </Modal>
    );
}