// Toggle.tsx
import React from 'react';

type ToggleProps = {
    value: boolean;
    onChange: (newValue: boolean) => void;
    activeColor?: string; // cor quando ativo
    inactiveColor?: string; // cor quando inativo
    size?: 'sm' | 'md' | 'lg'; // tamanhos pré-definidos
};

export const Toggle: React.FC<ToggleProps> = ({
    value,
    onChange,
    activeColor = 'bg-blue-600',
    inactiveColor = 'bg-zinc-600',
    size = 'md',
}) => {
    // Definição de tamanhos
    const sizes = {
        sm: { w: 'w-8', h: 'h-4', ball: 'w-3 h-3', translate: 'translate-x-3' },
        md: {
            w: 'w-10',
            h: 'h-6',
            ball: 'w-5 h-5',
            translate: 'translate-x-4',
        },
        lg: {
            w: 'w-12',
            h: 'h-7',
            ball: 'w-6 h-6',
            translate: 'translate-x-5',
        },
    };

    const current = sizes[size];

    return (
        <button
            type="button"
            onClick={() => onChange(!value)}
            className={`shrink-0 ${current.w} ${current.h} rounded-full transition-colors duration-200 relative ${value ? activeColor : inactiveColor}`}
        >
            <span
                className={`
                absolute top-0.5 left-0.5 ${current.ball} bg-white rounded-full shadow
                transition-transform duration-200
                ${value ? current.translate : 'translate-x-0'}`}
            />
        </button>
    );
};
