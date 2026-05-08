import bcrypt from 'bcryptjs';
import NextAuth from 'next-auth';
import Credentials from 'next-auth/providers/credentials';

// Importação lazy do Prisma para evitar erro no Edge Runtime do middleware
async function buscarUsuario(login: string) {
    const { prisma } = await import('./prisma');
    return await (prisma as any).usuario.findUnique({ where: { login } });
}

export const { handlers, signIn, signOut, auth } = NextAuth({
    pages: {
        signIn: '/login',
    },
    session: {
        strategy: 'jwt',
    },
    providers: [
        Credentials({
            name: 'credentials',
            credentials: {
                login: { label: 'Login', type: 'text' },
                senha: { label: 'Senha', type: 'password' },
            },

            async authorize(credentials) {
                const login = credentials?.login as string;
                const senha = credentials?.senha as string;

                if (!login?.trim() || !senha?.trim()) return null;

                // Importa o Prisma dinamicamente — não executa no Edge
                const usuario = await buscarUsuario(login.trim());
                if (!usuario) return null;

                const senhaValida = await bcrypt.compare(senha, usuario.senha);
                if (!senhaValida) return null;

                return {
                    id: usuario.id,
                    name: usuario.nome,
                    email: usuario.login,
                    papel: usuario.papel,
                    primeiroLogin: usuario.primeiroLogin,
                };
            },
        }),
    ],

    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token.id = user.id;
                token.papel = (user as any).papel;
                token.primeiroLogin = (user as any).primeiroLogin;
            }
            return token;
        },

        async session({ session, token }) {
            session.user.id = token.id as string;
            (session.user as any).papel = token.papel;
            (session.user as any).primeiroLogin = token.primeiroLogin;
            return session;
        },
    },
});