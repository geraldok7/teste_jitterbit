'use client'

export default function ConfiguracoesPage() {
  const apiUrl = process.env.API_URL || 'http://localhost:3001'
  return (
    <div>
      <div className="header">
        <div>
          <h1>Configurações</h1>
          <div className="subtitle">Parâmetros da aplicação</div>
        </div>
      </div>
      <section className="card">
        <div className="card-header">
          <h2 className="title">Ambiente</h2>
          <span className="muted">Variáveis principais</span>
        </div>
        <div className="card-body">
          <div className="row">
            <div className="field" style={{ gridColumn: '1 / -1' }}>
              <label>API_URL</label>
              <div className="chip">{apiUrl}</div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

