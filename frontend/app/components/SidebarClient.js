'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

export default function SidebarClient() {
  const pathname = usePathname()
  const isHome = pathname === '/'
  const isPedidos = pathname.startsWith('/pedidos')
  const isRelatorios = pathname.startsWith('/relatorios')
  const isConfig = pathname.startsWith('/configuracoes')
  return (
    <aside className="sidebar">
      <div className="brand"><span className="dot" /> Orders Dashboard</div>
      <nav className="nav">
        <Link className={isHome ? 'active' : ''} href="/">Dashboard</Link>
        <Link className={isPedidos ? 'active' : ''} href="/pedidos">Pedidos</Link>
        <Link className={isRelatorios ? 'active' : ''} href="/relatorios">Relatórios</Link>
        <Link className={isConfig ? 'active' : ''} href="/configuracoes">Configurações</Link>
        <a href="/health" target="_blank" rel="noreferrer">Health</a>
        <a href="http://localhost:3001/order/list" target="_blank" rel="noreferrer">API List</a>
      </nav>
    </aside>
  )
}
