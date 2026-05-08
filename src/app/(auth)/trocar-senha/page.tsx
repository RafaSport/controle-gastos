'use client'

import { useState } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Input from '@/components/ui/Input'
import Botao from '@/components/ui/Botao'

export default function PaginaTrocarSenha() {
  const { data: sessao } = useSession()
  const router = useRouter()

  const [novaSenha, setNovaSenha]       = useState('')
  const [confirmar, setConfirmar]       = useState('')
  const [erro, setErro]                 = useState('')
  const [carregando, setCarregando]     = useState(false)

  async function handleTrocarSenha() {
    setErro('')

    // Validações antes de enviar
    if (novaSenha.length < 5) {
      setErro('A senha deve ter pelo menos 5 caracteres.')
      return
    }
    if (novaSenha !== confirmar) {
      setErro('As senhas não coincidem.')
      return
    }

    setCarregando(true)

    const res = await fetch('/api/auth/alterar-senha', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        id: (sessao?.user as any)?.id,
        novaSenha,
      }),
    })

    setCarregando(false)

    if (!res.ok) {
      setErro('Erro ao alterar senha. Tente novamente.')
      return
    }

    // Redireciona para a tela correta após trocar a senha
    const papel = (sessao?.user as any)?.papel
    router.push(papel === 'ADMIN' ? '/admin' : '/comprador')
  }

  return (
    <div className="w-full max-w-sm">

      {/* Cabeçalho */}
      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold text-zinc-100">Primeiro Acesso</h1>
        <p className="text-sm text-zinc-500 mt-1">Crie uma senha com pelo menos 5 caracteres</p>
      </div>

      {/* Card do formulário */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 flex flex-col gap-4">

        <Input
          label="Nova senha"
          type="password"
          placeholder="mínimo 5 caracteres"
          value={novaSenha}
          onChange={(e) => setNovaSenha(e.target.value)}
        />

        <Input
          label="Confirmar senha"
          type="password"
          placeholder="repita a senha"
          value={confirmar}
          onChange={(e) => setConfirmar(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleTrocarSenha()}
        />

        {/* Mensagem de erro */}
        {erro && (
          <p className="text-xs text-red-400 text-center">{erro}</p>
        )}

        <Botao
          cor="verde"
          larguraTotal
          carregando={carregando}
          onClick={handleTrocarSenha}
        >
          Salvar senha e continuar
        </Botao>

      </div>
    </div>
  )
}