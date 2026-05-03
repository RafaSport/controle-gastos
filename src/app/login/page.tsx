export default function LoginPage() {
    return (
        <main className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
            {/* Card */}
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
                <form className="space-y-4">
                    {/* Login */}
                    <div>
                        <label className="text-sm text-gray-600">Login</label>

                        <input
                            type="text"
                            placeholder="paulo.jose"
                            className="w-full mt-1 h-12 px-4 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-700"
                        />
                    </div>

                    {/* Senha */}
                    <div>
                        <label className="text-sm text-gray-600">Senha</label>

                        <input
                            type="password"
                            placeholder="********"
                            className="w-full mt-1 h-12 px-4 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-700"
                        />
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
