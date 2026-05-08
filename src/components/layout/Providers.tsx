'use client'

import { SessionProvider } from 'next-auth/react'

// Envolve a aplicação com o contexto de sessão do Auth.js
export default function Providers({ children }: { children: React.ReactNode }) {
  return <SessionProvider>{children}</SessionProvider>
}