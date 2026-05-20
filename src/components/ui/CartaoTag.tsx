import { CORES_CARTAO, NOMES_CARTAO } from '@/config/cartoes';
import { calcularLarguraMinimaCartao } from '@/lib/utils';
import { Cartao } from '@/types';

interface CartaoTagProps {
    cartao: Cartao;
}

// Largura mínima calculada uma única vez com base no maior nome cadastrado
const LARGURA_MINIMA = calcularLarguraMinimaCartao(NOMES_CARTAO);

export default function CartaoTag({ cartao }: CartaoTagProps) {
    return (
        <span
            style={{
                backgroundColor: CORES_CARTAO[cartao],
                minWidth: LARGURA_MINIMA,
            }}
            className="inline-flex items-center justify-center px-3 py-1 rounded-md text-xs font-bold tracking-wide text-white"
        >
            {NOMES_CARTAO[cartao]}
        </span>
    );
}
