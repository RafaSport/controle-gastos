// Componente puro e reutilizável para seleção de cartão de crédito.
// Não tem estado próprio — recebe valor e callback do pai (controlled).

import { CORES_CARTAO, LISTA_CARTOES, NOMES_CARTAO } from '@/config/cartoes';
import { Cartao } from '@/types';

// ============================================
// INTERFACE — Props do componente
// ============================================

interface SeletorCartaoProps {
    /** Cartão atualmente selecionado */
    cartao: Cartao;
    /** Chamado quando o usuário clica em outro cartão */
    onChange: (cartao: Cartao) => void;
    /** Label opcional (padrão: "Cartão") */
    label?: string;
}

// ============================================
// COMPONENTE
// ============================================

export default function SeletorCartao({
    cartao,
    onChange,
    label = 'Cartão',
}: SeletorCartaoProps) {
    return (
        <div className="flex flex-col gap-1">
            {/* Label do campo */}
            <label className="text-sm font-medium text-zinc-300">{label}</label>

            {/* Grid de botões dos cartões */}
            <div className="flex gap-2">
                {LISTA_CARTOES.map((c) => {
                    const isSelecionado = cartao === c;

                    return (
                        <button
                            key={c}
                            type="button"
                            onClick={() => onChange(c)}
                            // Cor de fundo dinâmica: cor do cartão se selecionado, cinza se não
                            style={
                                isSelecionado
                                    ? { backgroundColor: CORES_CARTAO[c] }
                                    : {}
                            }
                            className={`
                                flex-1 py-2 rounded-lg text-xs font-bold transition-all
                                ${
                                    isSelecionado
                                        ? 'text-white'
                                        : 'bg-zinc-800 text-zinc-400 hover:bg-zinc-700'
                                }
                            `}
                        >
                            {NOMES_CARTAO[c]}
                        </button>
                    );
                })}
            </div>
        </div>
    );
}
