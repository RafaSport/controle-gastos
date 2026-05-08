'use client';

import { Eye, EyeOff } from 'lucide-react'; // biblioteca de ícones, pode trocar
import { InputHTMLAttributes, forwardRef, useState } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
    label?: string; // label acima do campo
    erro?: string; // mensagem de erro abaixo
    icone?: React.ReactNode; // ícone à esquerda
}

const Input = forwardRef<HTMLInputElement, InputProps>(
    ({ label, erro, icone, className = '', type = 'text', ...props }, ref) => {
        const [showPassword, setShowPassword] = useState(false);

        // Se for senha, alterna entre "password" e "text"
        const inputType = type === 'password' && showPassword ? 'text' : type;

        return (
            <div className="flex flex-col gap-1 w-full">
                {label && (
                    <label className="text-sm font-medium text-zinc-300">
                        {label}
                    </label>
                )}

                <div className="relative">
                    {icone && (
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400">
                            {icone}
                        </span>
                    )}

                    <input
                        ref={ref}
                        type={inputType}
                        className={`
              w-full bg-zinc-800 border rounded-lg
              text-zinc-100 placeholder:text-zinc-500
              text-sm px-3 py-2.5
              transition-colors duration-150
              focus:outline-none focus:ring-2 focus:ring-blue-500
              disabled:opacity-50 disabled:cursor-not-allowed
              ${erro ? 'border-red-500' : 'border-zinc-700 hover:border-zinc-500'}
              ${icone ? 'pl-9' : ''}
              ${type === 'password' ? 'pr-9' : ''}
              ${className}
            `}
                        {...props}
                    />

                    {/* Olhinho só aparece se for campo de senha */}
                    {type === 'password' && (
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-200"
                        >
                            {showPassword ? (
                                <EyeOff size={18} />
                            ) : (
                                <Eye size={18} />
                            )}
                        </button>
                    )}
                </div>

                {erro && <span className="text-xs text-red-400">{erro}</span>}
            </div>
        );
    }
);

Input.displayName = 'Input';
export default Input;
