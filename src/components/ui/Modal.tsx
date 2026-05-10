import { X } from 'lucide-react';
import { useEffect } from 'react';
import Botao from './Botao';

interface ModalProps {
    aberto: boolean;
    titulo: string;
    onFechar: () => void;
    children: React.ReactNode;
    tamanho?: 'sm' | 'md' | 'lg';
}

// Mapa de larguras por tamanho
const larguras = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
};

export default function Modal({
    aberto,
    titulo,
    onFechar,
    children,
    tamanho = 'md',
}: ModalProps) {
    // Bloqueia o scroll do body enquanto o modal está aberto
    useEffect(() => {
        document.body.style.overflow = aberto ? 'hidden' : '';
        return () => {
            document.body.style.overflow = '';
        };
    }, [aberto]);

    if (!aberto) return null;

    return (
        // Fundo escurecido — clique fora fecha o modal
        <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
            onClick={onFechar}
        >
            {/* Caixa do modal — para propagação para não fechar ao clicar dentro */}
            <div
                className={`
          w-full ${larguras[tamanho]}
          bg-zinc-900 border border-zinc-800
          rounded-xl shadow-2xl
          animate-fadeIn
        `}
                onClick={(e) => e.stopPropagation()}
            >
                {/* Cabeçalho com título e botão fechar */}
                <div className="flex items-center justify-between p-4 border-b border-zinc-800">
                    <h2 className="text-base font-semibold text-zinc-100">
                        {titulo}
                    </h2>
                    <Botao
                        cor="cinza"
                        tamanho="sm"
                        onClick={onFechar}
                        icone={<X size={18} strokeWidth={2.5} />}
                        aria-label="Fechar"
                    ></Botao>
                </div>

                {/* Conteúdo passado como children */}
                <div className="p-4">{children}</div>
            </div>
        </div>
    );
}
