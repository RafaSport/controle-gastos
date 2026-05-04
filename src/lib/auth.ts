import bcrypt from 'bcryptjs';
import NextAuth from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import { prisma } from './prisma';

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
                // LOG para ver o que está chegando
                console.log('>>> authorize chamado com:', credentials);

                const { login, senha } = credentials as {
                    login: string;
                    senha: string;
                };

                if (!login || !senha) {
                    console.log('>>> login ou senha vazios, retornando null');
                    return null;
                }

                const usuario = await (prisma as any).usuario.findUnique({
                    where: { login },
                });

                console.log(
                    '>>> usuario encontrado:',
                    usuario ? usuario.login : 'nenhum'
                );

                if (!usuario) return null;

                const senhaValida = await bcrypt.compare(senha, usuario.senha);
                console.log('>>> senha válida:', senhaValida);

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
