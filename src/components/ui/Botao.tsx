import { CorBotao, Tamanho } from '@/types';
import { ButtonHTMLAttributes } from 'react';

interface BotaoProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    cor?: CorBotao;
    tamanho?: Tamanho;
    icone?: React.ReactNode; // ícone opcional à esquerda do texto
    larguraTotal?: boolean; // ocupa 100% da largura do container
    carregando?: boolean; // mostra spinner e desabilita o botão
}

// Mapa de classes por cor
const coresBotao: Record<CorBotao, string> = {
    azul: 'bg-blue-600 hover:bg-blue-700 text-white',
    verde: 'bg-green-600 hover:bg-green-700 text-white',
    amarelo: 'bg-yellow-500 hover:bg-yellow-600 text-zinc-900',
    cinza: 'bg-zinc-700 hover:bg-zinc-600 text-zinc-100',
    vermelho: 'bg-red-600 hover:bg-red-700 text-white',
};

// Mapa de classes por tamanho
const tamanhosBotao: Record<Tamanho, string> = {
    sm: 'px-3 py-1.5 text-xs',
    md: 'px-4 py-2 text-sm',
    lg: 'px-6 py-3 text-base',
};

export default function Botao({
    cor = 'azul',
    tamanho = 'md',
    icone,
    larguraTotal = false,
    carregando = false,
    children,
    disabled,
    className = '',
    type = 'button',
    ...props
}: BotaoProps) {
    return (
        <button
            type={type}
            disabled={disabled || carregando}
            className={`
        inline-flex items-center justify-center gap-2
        font-medium rounded-lg
        transition-colors duration-150
        disabled:opacity-50 disabled:cursor-not-allowed
        ${coresBotao[cor]}
        ${tamanhosBotao[tamanho]}
        ${larguraTotal ? 'w-full' : ''}
        ${className}
      `}
            {...props}
        >
            {/* Spinner de carregamento */}
            {carregando && (
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            )}
            {/* Ícone opcional */}
            {!carregando && icone && <span className="shrink-0">{icone}</span>}
            {children}
        </button>
    );
}
