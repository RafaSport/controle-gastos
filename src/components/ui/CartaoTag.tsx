import { Cartao } from '@/types';

interface CartaoTagProps {
    cartao: Cartao;
}

// Cores de fundo usando estilos inline — necessário no Tailwind 4
// pois classes dinâmicas não são detectadas em tempo de build
const coresCartao: Record<Cartao, string> = {
    NUBANK: '#820AD1',
    INTER: '#FF6600',
    HIPER: '#CC0000',
    ITAU: '#003087',
};

const rotulosCartao: Record<Cartao, string> = {
    NUBANK: 'Nubank',
    INTER: 'Inter',
    HIPER: 'Hiper',
    ITAU: 'Itaú',
};

export default function CartaoTag({ cartao }: CartaoTagProps) {
    return (
        <span
            style={{ backgroundColor: coresCartao[cartao] }}
            className="inline-flex items-center justify-center px-3 py-1 rounded-md text-xs font-bold tracking-wide text-white"
        >
            {rotulosCartao[cartao]}
        </span>
    );
}