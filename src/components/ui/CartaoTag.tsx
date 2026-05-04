import { Cartao } from '@/types';

interface CartaoTagProps {
    cartao: Cartao;
}

// Cores de fundo e texto por cartão
const estilosCartao: Record<Cartao, string> = {
    NUBANK: 'bg-nubank  text-white',
    INTER: 'bg-inter   text-white',
    HIPER: 'bg-hiper   text-white',
    ITAU: 'bg-itau    text-white',
};

// Rótulos amigáveis dos cartões
const rotulosCartao: Record<Cartao, string> = {
    NUBANK: 'Nubank',
    INTER: 'Inter',
    HIPER: 'Hiper',
    ITAU: 'Itaú',
};

export default function CartaoTag({ cartao }: CartaoTagProps) {
    return (
        <span
            className={`
      inline-flex items-center justify-center
      px-3 py-1 rounded-md
      text-xs font-bold tracking-wide
      ${estilosCartao[cartao]}
    `}
        >
            {rotulosCartao[cartao]}
        </span>
    );
}
