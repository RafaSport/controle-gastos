// Badge de status: aberto (verde) ou finalizado (cinza)
interface BadgeProps {
    status: 'aberto' | 'finalizado';
}

export default function Badge({ status }: BadgeProps) {
    const estilos = {
        aberto: 'bg-green-500/15 text-green-400 border border-green-500/30',
        finalizado: 'bg-zinc-700/50 text-zinc-400 border border-zinc-600/30',
    };

    const rotulos = {
        aberto: 'Em aberto',
        finalizado: 'Finalizado',
    };

    return (
        <span
            className={`
      inline-flex items-center px-2 py-0.5
      rounded-full text-xs font-medium
      ${estilos[status]}
    `}
        >
            {rotulos[status]}
        </span>
    );
}
