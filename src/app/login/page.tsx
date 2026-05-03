'use client';

import { Eye, EyeOff } from 'lucide-react';
import { useState } from 'react';

export default function LoginPage() {
    const [mostrarSenha, setMostrarSenha] = useState(false);

    const [login, setLogin] = useState('');
    const [senha, setSenha] = useState('');

    const [erroLogin, setErroLogin] = useState('');
    const [erroSenha, setErroSenha] = useState('');

    function entrar() {
        let valido = true;

        setErroLogin('');
        setErroSenha('');

        if (!login.trim()) {
            setErroLogin('Informe seu login');
            valido = false;
        }

        if (!senha.trim()) {
            setErroSenha('Informe sua senha');
            valido = false;
        }

        if (!valido) return;

        // Login fake inicial
        if (login === 'admin' && senha === '12345') {
            localStorage.setItem('logado', 'true');
            window.location.href = '/';
            return;
        }

        setErroSenha('Login ou senha inválidos');
    }

    return (
        <main className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
            <section className="w-full max-w-md bg-white rounded-3xl shadow-sm p-6 md:p-8">
                {/* Topo */}
                <div className="text-center mb-8">
                    <div className="w-16 h-16 bg-gray-800 rounded-2xl mx-auto mb-4" />

                    <h1 className="text-2xl font-bold text-gray-800">
                        Controle de Gastos
                    </h1>

                    <p className="text-sm text-gray-500 mt-2">
                        Entre para continuar
                    </p>
                </div>

                {/* Formulário */}
                <form
                    className="space-y-4"
                    onSubmit={(e) => {
                        e.preventDefault();
                        entrar();
                    }}
                >
                    {/* Login */}
                    <div>
                        <label className="text-sm text-gray-600">Login</label>

                        <input
                            type="text"
                            value={login}
                            onChange={(e) => setLogin(e.target.value)}
                            placeholder="Seu Login"
                            className="w-full mt-1 h-12 px-4 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-700"
                        />

                        {erroLogin && (
                            <p className="text-red-500 text-sm mt-1">
                                {erroLogin}
                            </p>
                        )}
                    </div>

                    {/* Senha */}
                    <div>
                        <label className="text-sm text-gray-600">Senha</label>

                        <div className="relative mt-1">
                            <input
                                type={mostrarSenha ? 'text' : 'password'}
                                value={senha}
                                onChange={(e) => setSenha(e.target.value)}
                                placeholder="********"
                                className="w-full h-12 px-4 pr-12 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-700"
                            />

                            <button
                                type="button"
                                onClick={() => setMostrarSenha(!mostrarSenha)}
                                className="absolute right-3 top-3 text-gray-500"
                            >
                                {mostrarSenha ? (
                                    <EyeOff size={20} />
                                ) : (
                                    <Eye size={20} />
                                )}
                            </button>
                        </div>

                        {erroSenha && (
                            <p className="text-red-500 text-sm mt-1">
                                {erroSenha}
                            </p>
                        )}
                    </div>

                    {/* Botão */}
                    <button className="w-full h-12 bg-gray-800 text-white rounded-xl font-medium hover:bg-gray-700 transition">
                        Entrar
                    </button>
                </form>
            </section>
        </main>
    );
}
