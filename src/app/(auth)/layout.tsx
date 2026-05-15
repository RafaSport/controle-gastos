// Layout centralizado para as telas de autenticação (login, trocar senha)
export default function AuthLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="flex-1 bg-zinc-950 flex items-center justify-center p-4">
            {children}
        </div>
    );
}
