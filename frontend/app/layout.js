import './globals.css'
import SidebarClient from './components/SidebarClient'

function Sidebar() { return <SidebarClient /> }

function Header() {
  return (
    <header className="header">
      <div>
        <h1>Gestão de Pedidos</h1>
        <div className="subtitle">Dashboard completo com criação e listagem</div>
      </div>
      <div className="chip chip-success">Online</div>
    </header>
  )
}

export default function RootLayout({ children }) {
  return (
    <html lang="pt-br">
      <body>
        <div className="layout">
          <Sidebar />
          <main className="main">
            <Header />
            <div className="content container">
              {children}
            </div>
          </main>
        </div>
      </body>
    </html>
  )
}
