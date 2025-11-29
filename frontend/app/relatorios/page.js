'use client'

export default function RelatoriosPage() {
  return (
    <div>
      <div className="header">
        <div>
          <h1>Relatórios</h1>
          <div className="subtitle">Resumo e indicadores</div>
        </div>
      </div>
      <div className="stats">
        <div className="stat">
          <div className="label">Pedidos no mês</div>
          <div className="value">—</div>
        </div>
        <div className="stat">
          <div className="label">Ticket médio</div>
          <div className="value">—</div>
        </div>
        <div className="stat">
          <div className="label">Itens vendidos</div>
          <div className="value">—</div>
        </div>
      </div>
      <section className="card">
        <div className="card-header">
          <h2 className="title">Em breve</h2>
          <span className="muted">Relatórios detalhados</span>
        </div>
        <div className="card-body">
          <div className="empty">Em desenvolvimento</div>
        </div>
      </section>
    </div>
  )
}

