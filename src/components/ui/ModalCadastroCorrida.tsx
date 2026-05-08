'use client';

import { useState } from 'react';
import Botao from './Botao';
import Input from './Input';
import Modal from './Modal';

interface Props {
    aberto: boolean;
    usuarioId: string;
    onFechar: () => void;
    onSalvar: () => void;
}

export default function ModalCadastroCorrida({
    aberto,
    usuarioId,
    onFechar,
    onSalvar,
}: Props) {
    const hoje = new Date();
    const dataHoje = `${hoje.getFullYear()}-${String(hoje.getMonth() + 1).padStart(2, '0')}-${String(hoje.getDate()).padStart(2, '0')}`;

    const [data, setData] = useState(dataHoje);
    const [valor, setValor] = useState('');
    const [erro, setErro] = useState('');
    const [carregando, setCarregando] = useState(false);

    async function handleSalvar() {
        setErro('');

        if (!data) {
            setErro('Data obrigatória.');
            return;
        }
        if (!valor || parseFloat(valor) <= 0) {
            setErro('Valor inválido.');
            return;
        }

        setCarregando(true);

        const res = await fetch('/api/corridas', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                usuarioId,
                data,
                valor: parseFloat(valor.replace(',', '.')),
            }),
        });

        setCarregando(false);

        if (!res.ok) {
            setErro('Erro ao cadastrar corrida.');
            return;
        }

        setData(dataHoje);
        setValor('');
        onSalvar();
        onFechar();
    }

    return (
        <Modal aberto={aberto} titulo="Nova Corrida Uber" onFechar={onFechar}>
            <div className="flex flex-col gap-4">
                <Input
                    label="Data da corrida"
                    type="date"
                    value={data}
                    onChange={(e) => setData(e.target.value)}
                />

                <Input
                    label="Valor (R$)"
                    placeholder="Ex: 25,50"
                    value={valor}
                    onChange={(e) => setValor(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSalvar()}
                />

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
                        Salvar
                    </Botao>
                </div>
            </div>
        </Modal>
    );
}