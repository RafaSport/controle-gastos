import { buscarComprador, removerComprador } from '@/services/usuario.service'
import { NextRequest, NextResponse } from 'next/server'

// Busca um comprador pelo ID com suas compras
export async function GET(
    _: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        // No Next.js 15 o params é assíncrono
        const { id } = await params
        const usuario = await buscarComprador(id)
        if (!usuario) return NextResponse.json({ erro: 'Usuário não encontrado' }, { status: 404 })
        return NextResponse.json(usuario)
    } catch (erro: any) {
        return NextResponse.json({ erro: erro.message }, { status: 500 })
    }
}

// Remove um comprador pelo ID
export async function DELETE(
    _: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params
        await removerComprador(id)
        return NextResponse.json({ sucesso: true })
    } catch (erro: any) {
        return NextResponse.json({ erro: erro.message }, { status: 500 })
    }
}