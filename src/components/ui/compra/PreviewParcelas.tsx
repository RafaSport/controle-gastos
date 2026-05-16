// Componente que exibe o mês/ano final calculado de uma compra parcelada.
// Útil para dar feedback visual ao usuário antes de salvar.

// ============================================
// INTERFACE — Props do componente
// ============================================

interface PreviewParcelasProps {
    /** Texto com o mês final já formatado (ex: "Jul/2026") */
    mesFinal: string;
    /** Label opcional (padrão: "Término previsto") */
    label?: string;
}

// ============================================
// COMPONENTE
// ============================================

export default function PreviewParcelas({
    mesFinal,
    label = 'Término previsto',
}: PreviewParcelasProps) {
    return (
        <div className="bg-zinc-800 rounded-lg px-3 py-2">
            <p className="text-xs text-zinc-400">
                {label}:
                <span className="text-blue-400 font-medium ml-1">
                    {mesFinal}
                </span>
            </p>
        </div>
    );
}