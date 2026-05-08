'use client';

import Botao from '@/components/ui/Botao';
import Input from '@/components/ui/Input';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useRef, useState } from 'react';

export default function PaginaLogin() {
    const router = useRouter();
    const loginRef = useRef<HTMLInputElement>(null);

    const [login, setLogin] = useState('');
    const [senha, setSenha] = useState('');
    const [erro, setErro] = useState('');
    const [carregando, setCarregando] = useState(false);

    async function handleLogin() {
        setErro('');

        // Validação antes de bater na API
        if (!login.trim() || !senha.trim()) {
            setErro('Preencha o login e a senha para continuar.');
            loginRef.current?.focus();
            return;
        }

        setCarregando(true);

        const resultado = await signIn('credentials', {
            login,
            senha,
            redirect: false,
        });

        setCarregando(false);

        // No Auth.js v5 beta, verificamos o erro pelo campo 'error'
        if (!resultado || resultado.error) {
            setLogin('');
            setSenha('');
            setErro(
                'Login ou senha incorretos. Verifique seus dados e tente novamente.'
            );
            setTimeout(() => loginRef.current?.focus(), 50);
            return;
        }

        // Busca a sessão para saber o papel e se é primeiro login
        const sessaoRes = await fetch('/api/auth/session');
        const sessao = await sessaoRes.json();
        const usuario = sessao?.user;

        // Redireciona para troca de senha se for o primeiro acesso
        if (usuario?.primeiroLogin) {
            router.push('/trocar-senha');
            return;
        }

        // Redireciona conforme o papel do usuário
        router.push(usuario?.papel === 'ADMIN' ? '/admin' : '/comprador');
    }

    return (
        <div className="w-full max-w-sm">
            {/* Cabeçalho */}
            <div className="text-center mb-8">
                <h1 className="text-2xl font-bold text-zinc-100">
                    Controle de Gastos
                </h1>
                <p className="text-sm text-zinc-500 mt-1">
                    Faça login para continuar
                </p>
            </div>

            {/* Card do formulário */}
            <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 flex flex-col gap-4">
                <Input
                    ref={loginRef}
                    label="Login"
                    placeholder="seu.login"
                    value={login}
                    onChange={(e) => setLogin(e.target.value)}
                    autoComplete="username"
                    // Enter no campo login pula para o campo senha
                    onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                            e.preventDefault();
                            document.getElementById('campo-senha')?.focus();
                        }
                    }}
                />

                <Input
                    id="campo-senha"
                    label="Senha"
                    type="password"
                    placeholder="••••••"
                    value={senha}
                    onChange={(e) => setSenha(e.target.value)}
                    autoComplete="current-password"
                    // Enter no campo senha dispara o login
                    onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
                />

                {/* Mensagem de erro com caixa destacada */}
                {erro && (
                    <div className="flex items-start gap-2 bg-red-500/10 border border-red-500/30 rounded-lg px-3 py-2">
                        <span className="text-red-400 mt-0.5 shrink-0">⚠</span>
                        <p className="text-xs text-red-400">{erro}</p>
                    </div>
                )}

                <Botao
                    cor="azul"
                    larguraTotal
                    carregando={carregando}
                    onClick={handleLogin}
                >
                    Entrar
                </Botao>
            </div>
        </div>
    );
}
