'use client';

import Botao from '@/components/ui/Botao';
import Input from '@/components/ui/Input';
import { CHAVE_SESSAO_NAVEGADOR } from '@/lib/browser-session';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useRef, useState } from 'react';
import Feedback from '@/components/ui/Feedback';

type TipoFeedback = 'sucesso' | 'erro';

interface FeedbackState {
    tipo: TipoFeedback;
    mensagem: string;
}

export default function PaginaLogin() {
    const router = useRouter();
    const loginRef = useRef<HTMLInputElement>(null);

    const [login, setLogin] = useState('');
    const [senha, setSenha] = useState('');
    const [feedback, setFeedback] = useState<FeedbackState | null>(null);
    const [carregando, setCarregando] = useState(false);

    async function handleLogin() {
        setFeedback(null);

        // Validação antes de bater na API
        if (!login.trim() || !senha.trim()) {
            setFeedback({
                tipo: 'erro',
                mensagem: 'Preencha o login e a senha para continuar.',
            });
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
            setFeedback({
                tipo: 'erro',
                mensagem:
                    'Login ou senha incorretos. Verifique seus dados e tente novamente.',
            });
            setTimeout(() => loginRef.current?.focus(), 50);
            return;
        }

        // Marca que esta sessão pertence à janela atual do navegador.
        // O sessionStorage é apagado quando a aba/janela é fechada.
        sessionStorage.setItem(CHAVE_SESSAO_NAVEGADOR, 'ativa');

        // Se chegou aqui, login foi um sucesso, exibe feedback e então redireciona
        setFeedback({
            tipo: 'sucesso',
            mensagem: 'Login realizado com sucesso! Redirecionando...',
        });
    }

    // Lógica de redirecionamento que será chamada após o feedback de sucesso
    const handleRedirecionamentoPosLogin = async () => {
        setFeedback(null); // Limpa o feedback antes de redirecionar

        const sessaoRes = await fetch('/api/auth/session');
        const sessao = await sessaoRes.json();
        const usuario = sessao?.user;

        if (usuario?.primeiroLogin) {
            router.push('/trocar-senha');
            return;
        }

        router.push(usuario?.papel === 'ADMIN' ? '/admin' : '/comprador');
    };

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
                {feedback ? (
                    <Feedback
                        tipo={feedback.tipo}
                        mensagem={feedback.mensagem}
                        onConcluir={feedback.tipo === 'sucesso'
                            ? handleRedirecionamentoPosLogin
                            : () => setFeedback(null)
                        }
                    />
                ) : (
                    <>
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

                        <Botao
                            cor="azul"
                            larguraTotal
                            carregando={carregando}
                            onClick={handleLogin}
                        >
                            Entrar
                        </Botao>
                    </>
                )}
            </div>
        </div>
    );
}
