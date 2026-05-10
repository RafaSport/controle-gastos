'use client';

import { useEffect, useState } from 'react';
import Botao from './Botao';
import Input from './Input';
import Modal from './Modal';

interface Props {
    aberto: boolean;
    usuarioId: string;
    onFechar: () => void;
    onSalvar: () => void;
}

// Formata uma data para o formato yyyy-mm-dd usado pelo input type="date"
function formatarData(data: Date): string {
    return `${data.getFullYear()}-${String(data.getMonth() + 1).padStart(2, '0')}-${String(data.getDate()).padStart(2, '0')}`;
}

// Calcula a diferença em dias entre duas datas
function diferencaEmDias(dataStr: string): number {
    const hoje = new Date();
    hoje.setHours(0, 0, 0, 0);
    const dataSel = new Date(dataStr + 'T00:00:00');
    return Math.round(
        (hoje.getTime() - dataSel.getTime()) / (1000 * 60 * 60 * 24)
    );
}

export default function ModalCadastroCorrida({
    aberto,
    usuarioId,
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

    // Reseta o formulário sempre que o modal abre
    useEffect(() => {
        if (aberto) {
            setData(formatarData(new Date()));
            setValor('');
            setErro('');
            setAlerta('');
        }
    }, [aberto]);

    // Verifica alerta sempre que a data muda
    useEffect(() => {
        if (!data) return;
        const dias = diferencaEmDias(data);

        // Alerta se a corrida foi há 3 ou mais dias
        if (dias >= 3) {
            setAlerta(`Esta corrida foi há ${dias} dias. Tem certeza da data?`);
        } else {
            setAlerta('');
        }
    }, [data]);

    function handleMudancaData(novaData: string) {
        // Bloqueia datas futuras — não deixa selecionar
        if (novaData > dataHoje) return;
        setData(novaData);
    }

    async function handleSalvar() {
        setErro('');

        if (!data) {
            setErro('Data obrigatória.');
            return;
        }
        if (!valor || parseFloat(valor.replace(',', '.')) <= 0) {
            setErro('Valor inválido.');
            return;
        }
        if (data > dataHoje) {
            setErro('Não é possível cadastrar corridas futuras.');
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
                    max={dataHoje} // desabilita dias futuros no seletor
                    onChange={(e) => handleMudancaData(e.target.value)}
                />

                {/* Alerta para datas muito antigas */}
                {alerta && (
                    <div className="flex items-start gap-2 bg-yellow-500/10 border border-yellow-500/30 rounded-lg px-3 py-2">
                        <span className="text-yellow-400 shrink-0 mt-0.5">
                            ⚠
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
