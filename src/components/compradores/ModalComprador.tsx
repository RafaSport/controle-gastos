type Props = {
    aberto: boolean;
    nome: string;
    setNome: (valor: string) => void;
    editandoId: number | null;
    onClose: () => void;
    onSalvar: () => void;
};

export function ModalComprador({
    aberto,
    nome,
    setNome,
    editandoId,
    onClose,
    onSalvar,
}: Props) {
    if (!aberto) return null;

    function gerarLogin(nomeCompleto: string) {
        return nomeCompleto.toLowerCase().trim().replaceAll(' ', '.');
    }

    const loginGerado = gerarLogin(nome);
    const senhaGerada = `${loginGerado}12345`;

    return (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4 z-50">
            <div className="bg-white w-full max-w-md rounded-3xl p-6 space-y-4">
                <h2 className="text-xl font-bold text-gray-800">
                    {editandoId ? 'Editar Comprador' : 'Novo Comprador'}
                </h2>

                {/* Nome */}
                <div>
                    <label className="text-sm text-gray-600">
                        Nome completo
                    </label>

                    <input
                        value={nome}
                        onChange={(e) => setNome(e.target.value)}
                        className="w-full h-12 px-4 mt-1 border rounded-xl"
                    />
                </div>

                {/* Login */}
                <div>
                    <label className="text-sm text-gray-600">Login</label>

                    <input
                        value={loginGerado}
                        disabled
                        className="w-full h-12 px-4 mt-1 border rounded-xl bg-gray-100"
                    />
                </div>

                {/* Senha */}
                <div>
                    <label className="text-sm text-gray-600">
                        Senha inicial
                    </label>

                    <input
                        value={senhaGerada}
                        disabled
                        className="w-full h-12 px-4 mt-1 border rounded-xl bg-gray-100"
                    />
                </div>

                {/* Botões */}
                <div className="grid grid-cols-2 gap-3 pt-2">
                    <button
                        onClick={onClose}
                        className="h-12 rounded-xl border"
                    >
                        Cancelar
                    </button>

                    <button
                        onClick={onSalvar}
                        className="h-12 rounded-xl bg-gray-800 text-white"
                    >
                        Salvar
                    </button>
                </div>
            </div>
        </div>
    );
}
