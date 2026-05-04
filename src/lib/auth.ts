import bcrypt from 'bcryptjs';
import NextAuth from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import { prisma } from './prisma';

export const { handlers, signIn, signOut, auth } = NextAuth({
    // Define as páginas customizadas de autenticação
    pages: {
        signIn: '/login',
    },

    session: {
        strategy: 'jwt', // usa JWT para manter a sessão
    },

    providers: [
        Credentials({
            name: 'credentials',
            credentials: {
                login: { label: 'Login', type: 'text' },
                senha: { label: 'Senha', type: 'password' },
            },

            async authorize(credentials) {
                const { login, senha } = credentials as {
                    login: string;
                    senha: string;
                };

                if (!login || !senha) return null;

                // Busca o usuário pelo login no banco
                const usuario = await (prisma as any).usuario.findUnique({
                    where: { login },
                });

                if (!usuario) return null;

                // Compara a senha enviada com o hash salvo no banco
                const senhaValida = await bcrypt.compare(senha, usuario.senha);
                if (!senhaValida) return null;

                // Retorna os dados que ficarão no token JWT
                return {
                    id: usuario.id,
                    name: usuario.nome,
                    email: usuario.login, // NextAuth exige o campo email
                    papel: usuario.papel,
                    primeiroLogin: usuario.primeiroLogin,
                };
            },
        }),
    ],

    callbacks: {
        // Adiciona dados extras ao token JWT
        async jwt({ token, user }) {
            if (user) {
                token.id = user.id;
                token.papel = (user as any).papel;
                token.primeiroLogin = (user as any).primeiroLogin;
            }
            return token;
        },

        // Repassa os dados do token para a sessão acessível no front
        async session({ session, token }) {
            session.user.id = token.id as string;
            (session.user as any).papel = token.papel;
            (session.user as any).primeiroLogin = token.primeiroLogin;
            return session;
        },
    },
});
