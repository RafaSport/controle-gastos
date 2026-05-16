import { CORES_CARTAO, NOMES_CARTAO } from '@/config/cartoes';
import { Cartao } from '@/types';

interface CartaoTagProps {
    cartao: Cartao;
}

export default function CartaoTag({ cartao }: CartaoTagProps) {
    return (
        <span
            style={{ backgroundColor: CORES_CARTAO[cartao] }}
            className="inline-flex items-center justify-center px-3 py-1 rounded-md text-xs font-bold tracking-wide text-white"
        >
            {NOMES_CARTAO[cartao]}
        </span>
    );
}
