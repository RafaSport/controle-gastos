import { InputHTMLAttributes, forwardRef } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
    label?: string; // label acima do campo
    erro?: string; // mensagem de erro abaixo
    icone?: React.ReactNode; // ícone à esquerda
}

// forwardRef permite que o Input seja controlado por react-hook-form futuramente
const Input = forwardRef<HTMLInputElement, InputProps>(
    ({ label, erro, icone, className = '', ...props }, ref) => {
        return (
            <div className="flex flex-col gap-1 w-full">
                {/* Label opcional */}
                {label && (
                    <label className="text-sm font-medium text-zinc-300">
                        {label}
                    </label>
                )}

                <div className="relative">
                    {/* Ícone opcional posicionado à esquerda */}
                    {icone && (
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400">
                            {icone}
                        </span>
                    )}

                    <input
                        ref={ref}
                        className={`
              w-full bg-zinc-800 border rounded-lg
              text-zinc-100 placeholder:text-zinc-500
              text-sm px-3 py-2.5
              transition-colors duration-150
              focus:outline-none focus:ring-2 focus:ring-blue-500
              disabled:opacity-50 disabled:cursor-not-allowed
              ${erro ? 'border-red-500' : 'border-zinc-700 hover:border-zinc-500'}
              ${icone ? 'pl-9' : ''}
              ${className}
            `}
                        {...props}
                    />
                </div>

                {/* Mensagem de erro */}
                {erro && <span className="text-xs text-red-400">{erro}</span>}
            </div>
        );
    }
);

Input.displayName = 'Input';
export default Input;
