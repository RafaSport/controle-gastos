export default function Footer() {
    const anoAtual = new Date().getFullYear();

    return (
        <footer className="w-full border-t border-zinc-800 bg-zinc-950 px-4 py-4">
            <div className="max-w-4xl mx-auto text-center">
                {/* Assinatura discreta do projeto exibida no rodape do sistema. */}
                <p className="text-xs text-zinc-500">
                    Feito com dedicação por Rafael Guedes &copy;{' '}
                    {anoAtual}
                </p>
            </div>
        </footer>
    );
}