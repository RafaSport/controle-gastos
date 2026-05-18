import { auth } from '@/lib/auth';
import { NextResponse } from 'next/server';

export default auth((req) => {
    const { pathname } = req.nextUrl;
    const sessao = req.auth;
    const usuario = sessao?.user as any;

    // Se não estiver logado e tentar acessar rota protegida → login
    if (!sessao && pathname !== '/login' && pathname !== '/trocar-senha') {
        return NextResponse.redirect(new URL('/login', req.url));
    }

    // Se já estiver logado e tentar acessar o login → redireciona para sua tela
    if (sessao && pathname === '/login') {
        const destino = usuario?.papel === 'ADMIN' ? '/admin' : '/comprador';
        return NextResponse.redirect(new URL(destino, req.url));
    }

    // Comprador tentando acessar área do admin → redireciona para sua tela
    if (
        sessao &&
        usuario?.papel === 'COMPRADOR' &&
        pathname.startsWith('/admin')
    ) {
        return NextResponse.redirect(new URL('/comprador', req.url));
    }

    // Admin tentando acessar área do comprador → redireciona para sua tela
    if (sessao && usuario?.papel === 'ADMIN' && pathname === '/comprador') {
        return NextResponse.redirect(new URL('/admin', req.url));
    }

    return NextResponse.next();
});

export const config = {
    matcher: [
        '/((?!api|_next/static|_next/image|favicon.ico|manifest.json|icon-192.png|icon-512.png|maskable-icon-512.png).*)',
    ],
};
