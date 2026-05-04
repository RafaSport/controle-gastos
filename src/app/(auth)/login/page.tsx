'use client';

import Botao from '@/components/ui/Botao';
import Input from '@/components/ui/Input';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function PaginaLogin() {
    const router = useRouter();

    const [login, setLogin] = useState('');
    const [senha, setSenha] = useState('');
    const [erro, setErro] = useState('');
    const [carregando, setCarregando] = useState(false);

    async function handleLogin() {
        // Limpa erro anterior e ativa o estado de carregamento
        setErro('');
        setCarregando(true);

        const resultado = await signIn('credentials', {
            login,
            senha,
            redirect: false, // evita redirecionamento automático para tratar o erro aqui
        });

        setCarregando(false);

        if (!resultado?.ok) {
            setErro('Login ou senha incorretos.');
            return;
        }

        // Busca a sessão para saber o papel e se é primeiro login
        const sessaoRes = await fetch('/api/auth/session');
        const sessao = await sessaoRes.json();
        const usuario = sessao?.user;

        if (!usuario) {
            setErro('Erro ao carregar sessão.');
            return;
        }

        // Redireciona para troca de senha se for o primeiro acesso
        if (usuario.primeiroLogin) {
            router.push('/trocar-senha');
            return;
        }

        // Redireciona conforme o papel do usuário
        if (usuario.papel === 'ADMIN') {
            router.push('/admin');
        } else {
            router.push('/comprador');
        }
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
                    label="Login"
                    placeholder="seu.login"
                    value={login}
                    onChange={(e) => setLogin(e.target.value)}
                    autoComplete="username"
                />

                <Input
                    label="Senha"
                    type="password"
                    placeholder="••••••"
                    value={senha}
                    onChange={(e) => setSenha(e.target.value)}
                    autoComplete="current-password"
                    // Permite enviar com Enter
                    onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
                />

                {/* Mensagem de erro */}
                {erro && (
                    <p className="text-xs text-red-400 text-center">{erro}</p>
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
