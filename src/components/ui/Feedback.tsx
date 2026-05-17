'use client';

import { useEffect } from 'react';

type TipoFeedback = 'sucesso' | 'erro';

interface Props {
    tipo: TipoFeedback;
    mensagem: string;
    onConcluir: () => void;
    duracao?: number;
}

export default function Feedback({
    tipo,
    mensagem,
    onConcluir,
    duracao,
}: Props) {
    const tempo = duracao ?? (tipo === 'erro' ? 1500 : 1000);

    useEffect(() => {
        const timer = setTimeout(onConcluir, tempo);
        return () => clearTimeout(timer);
    }, [onConcluir, tempo]);

    const estilos = {
        sucesso: {
            icone: '✓',
            corIcone: 'text-green-400',
            corTexto: 'text-green-400',
            corFundo: 'bg-green-500/20',
            corBorda: 'border-green-500/30',
        },
        erro: {
            icone: '✕',
            corIcone: 'text-red-400',
            corTexto: 'text-red-400',
            corFundo: 'bg-red-500/20',
            corBorda: 'border-red-500/30',
        },
    };

    const s = estilos[tipo];

    return (
        <div
            className={`flex flex-col items-center justify-center gap-3 py-8 px-4 rounded-lg border ${s.corBorda}`}
        >
            <div
                className={`w-12 h-12 rounded-full ${s.corFundo} flex items-center justify-center`}
            >
                <span className={`${s.corIcone} text-2xl font-bold`}>
                    {s.icone}
                </span>
            </div>
            <p className={`${s.corTexto} font-medium text-center`}>
                {mensagem}
            </p>
        </div>
    );
}