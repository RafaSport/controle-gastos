'use client';

import { useEffect, useState } from 'react';
import Botao from './Botao';
import Input from './Input';
import Modal from './Modal';

interface Props {
    aberto: boolean;
    usuarioId: string;
    mesEmAberto: number;
    anoEmAberto: number;
    onFechar: () => void;
    onSalvar: () => void;
}

const MESES = [
    'Jan',
    'Fev',
    'Mar',
    'Abr',
    'Mai',
    'Jun',
    'Jul',
    'Ago',
    'Set',
    'Out',
    'Nov',
    'Dez',
];

function formatarData(data: Date): string {
    return `${data.getFullYear()}-${String(data.getMonth() + 1).padStart(2, '0')}-${String(data.getDate()).padStart(2, '0')}`;
}

function diferencaEmDias(dataStr: string): number {
    const hoje = new Date();
    hoje.setHours(0, 0, 0, 0);

    const dataSelecionada = new Date(`${dataStr}T00:00:00`);

    return Math.round(
        (hoje.getTime() - dataSelecionada.getTime()) / (1000 * 60 * 60 * 24)
    );
}

export default function ModalCadastroCorrida({
    aberto,
    usuarioId,
    mesEmAberto,
    anoEmAberto,
    onFechar,
    onSalvar,
}: Props) {
    const hoje = new Date();
    const dataHoje = formatarData(hoje);

    const [data, setData] = useState(dataHoje);
    const [valor, setValor] = useState('');
    const [erro, setErro] = useState('');
    const [alerta, setAlerta] = useState('');
    const [carregando, setCarregando] = useState(false);

    useEffect(() => {
        if (aberto) {
            setData(formatarData(new Date()));
            setValor('');
            setErro('');
            setAlerta('');
        }
    }, [aberto]);

    useEffect(() => {
        if (!data) return;

        const dias = diferencaEmDias(data);

        if (dias >= 3) {
            setAlerta(`Esta corrida foi ha ${dias} dias. Tem certeza da data?`);
        } else {
            setAlerta('');
        }
    }, [data]);

    function handleMudancaData(novaData: string) {
        if (novaData > dataHoje) return;
        setData(novaData);
    }

    async function handleSalvar() {
        setErro('');

        if (!data) {
            setErro('Data obrigatoria.');
            return;
        }

        if (!valor || parseFloat(valor.replace(',', '.')) <= 0) {
            setErro('Valor invalido.');
            return;
        }

        setCarregando(true);

        const res = await fetch('/api/corridas', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                usuarioId,
                data,
                mesReferencia: mesEmAberto,
                anoReferencia: anoEmAberto,
                valor: parseFloat(valor.replace(',', '.')),
            }),
        });

        setCarregando(false);

        if (!res.ok) {
            setErro('Erro ao cadastrar corrida.');
            return;
        }

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
                    max={dataHoje}
                    onChange={(e) => handleMudancaData(e.target.value)}
                />

                {/* Informa em qual mes financeiro a corrida sera cobrada. */}
                <div className="bg-zinc-800 rounded-lg px-3 py-2">
                    <p className="text-xs text-zinc-400">
                        Corrida sera lancada em:
                        <span className="text-blue-400 font-medium ml-1">
                            {MESES[mesEmAberto - 1]}/{anoEmAberto}
                        </span>
                    </p>
                </div>

                {alerta && (
                    <div className="flex items-start gap-2 bg-yellow-500/10 border border-yellow-500/30 rounded-lg px-3 py-2">
                        <span className="text-yellow-400 shrink-0 mt-0.5">
                            !
                        </span>
                        <p className="text-xs text-yellow-400">{alerta}</p>
                    </div>
                )}

                <Input
                    label="Valor (R$)"
                    placeholder="Ex: 25,50"
                    value={valor}
                    onChange={(e) => setValor(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSalvar()}
                />

                {erro && (
                    <div className="flex items-start gap-2 bg-red-500/10 border border-red-500/30 rounded-lg px-3 py-2">
                        <span className="text-red-400 shrink-0">!</span>
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
