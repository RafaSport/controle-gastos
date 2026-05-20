import React from 'react';

export interface Coluna<T> {
    header: string;
    render: (item: T) => React.ReactNode;
    align?: 'left' | 'center' | 'right';
}

interface TabelaBaseProps<T> {
    dados: T[];
    colunas: Coluna<T>[];
    acoes?: (item: T) => React.ReactNode;
    emptyMessage?: string;
    keyExtractor?: (item: T, index: number) => string;
    // Linha clicável — usado na tabela de compradores
    onRowClick?: (item: T) => void;
}

export default function TabelaBase<T>({
    dados,
    colunas,
    acoes,
    emptyMessage = 'Nenhum registro encontrado.',
    keyExtractor,
    onRowClick,
}: TabelaBaseProps<T>) {
    if (dados.length === 0) {
        return (
            <div className="text-center py-12 text-zinc-500 text-sm">
                {emptyMessage}
            </div>
        );
    }

    return (
        <div className="w-full overflow-x-auto rounded-lg border border-zinc-800">
            {/* CORREÇÃO: largura mínima responsiva usando classes padrão Tailwind */}
            <table className="w-full text-sm min-w-80 sm:min-w-[30rem] md:min-w-[40rem]">
                <thead>
                    <tr className="bg-zinc-800 text-zinc-400 text-xs uppercase tracking-wide">
                        {colunas.map((col, i) => (
                            <th
                                key={i}
                                className={`px-2 sm:px-3 py-2 sm:py-3 text-${col.align ?? 'left'}`}
                            >
                                {col.header}
                            </th>
                        ))}
                        {acoes && (
                            <th className="px-2 sm:px-3 py-2 sm:py-3 text-center">
                                Ações
                            </th>
                        )}
                    </tr>
                </thead>
                <tbody>
                    {dados.map((item, index) => (
                        <tr
                            key={
                                keyExtractor ? keyExtractor(item, index) : index
                            }
                            onClick={
                                onRowClick ? () => onRowClick(item) : undefined
                            }
                            className={`
                                ${index % 2 === 0 ? 'bg-zinc-900' : 'bg-zinc-800'}
                                ${onRowClick ? 'cursor-pointer hover:bg-blue-500/10 transition-colors duration-100' : ''}
                            `}
                        >
                            {colunas.map((col, i) => (
                                <td
                                    key={i}
                                    className={`px-1.5 sm:px-2 py-1.5 sm:py-2 text-${col.align ?? 'left'} text-zinc-200`}
                                >
                                    {col.render(item)}
                                </td>
                            ))}
                            {acoes && (
                                <td className="px-1.5 sm:px-2 py-1.5 sm:py-2">
                                    <div className="flex gap-1 justify-center">
                                        {acoes(item)}
                                    </div>
                                </td>
                            )}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}