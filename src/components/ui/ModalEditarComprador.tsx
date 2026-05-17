'use client';

import { apiPatch, apiPut } from '@/lib/api-client';
import { useEffect, useState } from 'react';
import Botao from './Botao';
import Feedback from './Feedback';
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
    const [carregando, setCarregando] = useState(false);
    const [resetando, setResetando] = useState(false);
    const [feedback, setFeedback] = useState<{
        tipo: 'sucesso' | 'erro';
        msg: string;
    } | null>(null);

    useEffect(() => {
        if (comprador) {
            setNome(comprador.nome);
            setSobrenome(comprador.sobrenome);
            setUsaUber(comprador.usaUber);
            setFeedback(null);
        }
    }, [comprador]);

    async function handleSalvar() {
        setFeedback(null);

        if (!nome.trim() || !sobrenome.trim()) {
            setFeedback({
                tipo: 'erro',
                msg: 'Nome e sobrenome são obrigatórios.',
            });
            return;
        }

        setCarregando(true);

        try {
            await apiPut(`/api/usuarios/${comprador?.id}`, {
                nome: nome.trim(),
                sobrenome: sobrenome.trim(),
                usaUber,
            });

            setCarregando(false);
            setFeedback({ tipo: 'sucesso', msg: 'Comprador atualizado!' });
        } catch (err: any) {
            setCarregando(false);
            setFeedback({
                tipo: 'erro',
                msg: err.message || 'Erro ao atualizar comprador.',
            });
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
        setFeedback(null);

        try {
            await apiPatch('/api/auth/alterar-senha', { id: comprador?.id });

            setResetando(false);
            setFeedback({ tipo: 'sucesso', msg: 'Senha resetada!' });
        } catch (err: any) {
            setResetando(false);
            setFeedback({
                tipo: 'erro',
                msg: err.message || 'Erro ao resetar senha.',
            });
        }
    }

    function handleConcluir() {
        const eraSucesso = feedback?.tipo === 'sucesso';
        setFeedback(null);

        if (eraSucesso) {
            onSalvar();
            onFechar();
        }
    }

    function handleFechar() {
        setFeedback(null);
        onFechar();
    }

    return (
        <Modal
            aberto={aberto}
            titulo="Editar Comprador"
            onFechar={handleFechar}
        >
            <div className="flex flex-col gap-4">
                {feedback ? (
                    <Feedback
                        tipo={feedback.tipo}
                        mensagem={feedback.msg}
                        onConcluir={handleConcluir}
                    />
                ) : (
                    <>
                        <Input
                            label="Nome"
                            value={nome}
                            onChange={(e) => setNome(e.target.value)}
                        />

                        <Input
                            label="Sobrenome"
                            value={sobrenome}
                            onChange={(e) => setSobrenome(e.target.value)}
                            onKeyDown={(e) =>
                                e.key === 'Enter' && handleSalvar()
                            }
                        />

                        <div className="flex items-center justify-between bg-zinc-800 rounded-lg px-3 py-2.5">
                            <div>
                                <p className="text-sm text-zinc-200">
                                    Usa Uber
                                </p>
                                <p className="text-xs text-zinc-500">
                                    Habilita controle de corridas
                                </p>
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
                                <p className="text-sm text-zinc-200">
                                    Senha esquecida?
                                </p>
                                <p className="text-xs text-zinc-500">
                                    Reseta para{' '}
                                    <span className="text-zinc-400 font-medium">
                                        {comprador?.login}123
                                    </span>
                                </p>
                            </div>
                            <Botao
                                cor="cinza"
                                tamanho="sm"
                                carregando={resetando}
                                onClick={handleResetarSenha}
                            >
                                Resetar
                            </Botao>
                        </div>

                        <div className="flex gap-2 justify-end">
                            <Botao cor="cinza" onClick={handleFechar}>
                                Cancelar
                            </Botao>
                            <Botao
                                cor="verde"
                                carregando={carregando}
                                onClick={handleSalvar}
                            >
                                Salvar
                            </Botao>
                        </div>
                    </>
                )}
            </div>
        </Modal>
    );
}