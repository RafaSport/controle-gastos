'use client';

import { apiPost } from '@/lib/api-client';
import { useState } from 'react';
import Botao from './Botao';
import Feedback from './Feedback';
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
    const [carregando, setCarregando] = useState(false);
    const [feedback, setFeedback] = useState<{
        tipo: 'sucesso' | 'erro';
        msg: string;
    } | null>(null);

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
            await apiPost('/api/usuarios', {
                nome: nome.trim(),
                sobrenome: sobrenome.trim(),
                usaUber,
            });

            setCarregando(false);
            setFeedback({ tipo: 'sucesso', msg: 'Comprador cadastrado!' });
        } catch (err: any) {
            setCarregando(false);
            setFeedback({
                tipo: 'erro',
                msg: err.message || 'Erro ao cadastrar comprador.',
            });
        }
    }

    function handleConcluir() {
        const eraSucesso = feedback?.tipo === 'sucesso';
        setFeedback(null);

        if (eraSucesso) {
            setNome('');
            setSobrenome('');
            setUsaUber(false);
            onSalvar();
            onFechar();
        }
    }

    function handleFechar() {
        setFeedback(null);
        setNome('');
        setSobrenome('');
        setUsaUber(false);
        onFechar();
    }

    return (
        <Modal aberto={aberto} titulo="Novo Comprador" onFechar={handleFechar}>
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
                            placeholder="Ex: Ana"
                            value={nome}
                            onChange={(e) => setNome(e.target.value)}
                        />

                        <Input
                            label="Sobrenome"
                            placeholder="Ex: Bia"
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

                        <div className="flex gap-2 justify-end">
                            <Botao cor="cinza" onClick={handleFechar}>
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
                    </>
                )}
            </div>
        </Modal>
    );
}