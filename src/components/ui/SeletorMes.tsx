const MESES = [
    'Jan',
    'Fev',
    'Mar',
    'Abr',
    'Mai',
    'Jun',
    'Jul',
    'Ago',
    'Set',
    'Out',
    'Nov',
    'Dez',
];

interface SeletorMesProps {
    mesSelecionado: number;
    anoSelecionado: number;
    // mesAtual agora representa o primeiro mês em aberto, não necessariamente o mês real
    mesAtual: number;
    anoAtual: number;
    mesesDisponiveis: { mes: number; ano: number; fechado: boolean }[];
    onChange: (mes: number, ano: number) => void;
}

export default function SeletorMes({
    mesSelecionado,
    anoSelecionado,
    mesAtual,
    anoAtual,
    mesesDisponiveis,
    onChange,
}: SeletorMesProps) {
    return (
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
            {mesesDisponiveis.map(({ mes, ano, fechado }) => {
                const eSelecionado =
                    mes === mesSelecionado && ano === anoSelecionado;
                const eEmAberto = mes === mesAtual && ano === anoAtual;

                // Meses antes do primeiro em aberto ficam apagados (inclui fechados)
                const ePassado = ano * 12 + mes < anoAtual * 12 + mesAtual;

                return (
                    <button
                        key={`${mes}-${ano}`}
                        onClick={() => onChange(mes, ano)}
                        className={`
                            shrink-0 flex flex-col items-center
                            px-3 py-2 rounded-lg text-xs font-medium
                            transition-all duration-150
                            ${
                                eSelecionado
                                    ? 'bg-blue-600 text-white'
                                    : eEmAberto
                                      ? 'bg-zinc-700 text-zinc-100 ring-1 ring-blue-500'
                                      : ePassado
                                        ? 'bg-zinc-900 text-zinc-500 opacity-60'
                                        : 'bg-zinc-800 text-zinc-300 hover:bg-zinc-700'
                            }
                        `}
                    >
                        <span>{MESES[mes - 1]}</span>
                        <span className="text-[10px] opacity-70">{ano}</span>
                        {/* Ponto indicador de mês fechado */}
                        {fechado && (
                            <span className="w-1 h-1 rounded-full bg-zinc-500 mt-0.5" />
                        )}
                    </button>
                );
            })}
        </div>
    );
}