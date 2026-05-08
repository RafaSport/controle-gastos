import NextAuth from 'next-auth';
import Credentials from 'next-auth/providers/credentials';

// auth.ts não importa Prisma diretamente — o authorize fica no servidor
// O middleware usa apenas o JWT para verificar a sessão
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
            // authorize fica vazio aqui — a lógica real está na route handler
            async authorize() {
                return null;
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