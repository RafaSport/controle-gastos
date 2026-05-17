'use client';

import Botao from './Botao';
import Modal from './Modal';

// ============================================
// INTERFACE — Props do modal de confirmação
// ============================================

interface Props {
    /** Controla visibilidade do modal */
    aberto: boolean;
    /** Título exibido no cabeçalho */
    titulo: string;
    /** Mensagem descritiva da ação */
    mensagem: string;
    /** Texto do botão de confirmação (padrão: "Confirmar") */
    textoConfirmar?: string;
    /** Texto do botão de cancelamento (padrão: "Cancelar") */
    textoCancelar?: string;
    /** Cor do botão de confirmação */
    corConfirmar?: 'vermelho' | 'verde' | 'amarelo' | 'azul';
    /** Estado de carregamento do botão de confirmação */
    carregando?: boolean;
    /** Callback ao confirmar */
    onConfirmar: () => void;
    /** Callback ao cancelar/fechar */
    onCancelar: () => void;
}

// ============================================
// COMPONENTE — Modal de confirmação genérico
// ============================================

export default function ModalConfirmacao({
    aberto,
    titulo,
    mensagem,
    textoConfirmar = 'Confirmar',
    textoCancelar = 'Cancelar',
    corConfirmar = 'vermelho',
    carregando = false,
    onConfirmar,
    onCancelar,
}: Props) {
    return (
        <Modal aberto={aberto} titulo={titulo} onFechar={onCancelar}>
            <div className="flex flex-col gap-4">
                {/* Mensagem descritiva */}
                <p className="text-sm text-zinc-300">{mensagem}</p>

                {/* Botões de ação */}
                <div className="flex gap-2 justify-end">
                    <Botao cor="cinza" onClick={onCancelar}>
                        {textoCancelar}
                    </Botao>
                    <Botao
                        cor={corConfirmar}
                        carregando={carregando}
                        onClick={onConfirmar}
                    >
                        {textoConfirmar}
                    </Botao>
                </div>
            </div>
        </Modal>
    );
}