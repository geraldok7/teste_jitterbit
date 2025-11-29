'use client'

import { useEffect, useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'

export default function Home() {
  const router = useRouter()
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [toast, setToast] = useState('')
  const [query, setQuery] = useState('')

  const [numeroPedido, setNumeroPedido] = useState('')
  const [valorTotal, setValorTotal] = useState('')
  const [dataCriacao, setDataCriacao] = useState(() => new Date().toISOString())
  const [items, setItems] = useState([
    { idItem: '2434', quantidadeItem: 1, valorItem: 1000 }
  ])

  const totalCalc = useMemo(() => {
    try {
      const v = items.reduce((acc, it) => acc + Number(it.valorItem || 0) * Number(it.quantidadeItem || 0), 0)
      return v
    } catch {
      return 0
    }
  }, [items])

  function showToast(message) {
    setToast(message)
    setTimeout(() => setToast(''), 3000)
  }

  async function loadOrders() {
    setLoading(true)
    setError('')
    try {
      const r = await fetch('/order/list')
      if (!r.ok) throw new Error(`HTTP ${r.status}`)
      const data = await r.json()
      setOrders(data)
    } catch (e) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { loadOrders() }, [])

  function updateItem(index, patch) {
    setItems((prev) => prev.map((it, i) => (i === index ? { ...it, ...patch } : it)))
  }
  function addItem() {
    setItems((prev) => [...prev, { idItem: '', quantidadeItem: 1, valorItem: 0 }])
  }
  function removeItem(index) {
    setItems((prev) => prev.filter((_, i) => i !== index))
  }

  async function onSubmit(e) {
    e.preventDefault()
    setError('')
    const body = {
      numeroPedido: numeroPedido,
      valorTotal: Number(valorTotal || totalCalc || 0),
      dataCriacao: dataCriacao,
      items: items.map((it) => ({
        idItem: String(it.idItem || ''),
        quantidadeItem: Number(it.quantidadeItem || 0),
        valorItem: Number(it.valorItem || 0)
      }))
    }
    try {
      const r = await fetch('/order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      })
      if (!r.ok) {
        const err = await r.json().catch(() => ({}))
        throw new Error(err?.message || `HTTP ${r.status}`)
      }
      const created = await r.json()
      showToast(`Pedido criado: ${created.orderId}`)
      setNumeroPedido('')
      setValorTotal('')
      setDataCriacao(new Date().toISOString())
      setItems([{ idItem: '', quantidadeItem: 1, valorItem: 0 }])
      loadOrders()
    } catch (e) {
      setError(e.message)
    }
  }

  return (
    <main>
      {toast && <div className="toast">{toast}</div>}
      <div className="stats">
        <div className="stat">
          <div className="label">Pedidos</div>
          <div className="value">{orders.length}</div>
        </div>
        <div className="stat">
          <div className="label">Valor total</div>
          <div className="value">R$ {orders.reduce((a, o) => a + Number(o.value || 0), 0).toFixed(2)}</div>
        </div>
        <div className="stat">
          <div className="label">Último pedido</div>
          <div className="value">{orders[0] ? new Date(orders[0].creationDate).toLocaleString('pt-BR') : '-'}</div>
        </div>
      </div>

      <div className="hero">
        <section className="card">
          <div className="card-header">
            <h2 className="title">Novo Pedido</h2>
            <span className="muted">Preencha os campos e envie</span>
          </div>
          <div className="card-body">
            <form onSubmit={onSubmit}>
              <div className="row">
                <div className="field">
                  <label>Número do Pedido</label>
                  <input className="input" placeholder="v10089016vdb-01" value={numeroPedido} onChange={(e) => setNumeroPedido(e.target.value)} required />
                </div>
                <div className="field">
                  <label>Valor Total</label>
                  <input className="input" type="number" placeholder="10000" value={valorTotal} onChange={(e) => setValorTotal(e.target.value)} min={0} />
                </div>
              </div>

              <div className="row">
                <div className="field">
                  <label>Data de Criação</label>
                  <input className="input" type="datetime-local" value={new Date(dataCriacao).toISOString().slice(0,16)} onChange={(e) => {
                    const iso = new Date(e.target.value).toISOString()
                    setDataCriacao(iso)
                  }} />
                </div>
                <div className="field">
                  <label>Itens — Total calculado</label>
                  <div className="chip">R$ {totalCalc.toFixed(2)}</div>
                </div>
              </div>

              {items.map((it, idx) => (
                <div key={idx} className="row3" style={{ marginTop: 12 }}>
                  <div className="field">
                    <label>ID do Produto</label>
                    <input className="input" value={it.idItem} onChange={(e) => updateItem(idx, { idItem: e.target.value })} placeholder="2434" />
                  </div>
                  <div className="field">
                    <label>Quantidade</label>
                    <input className="input" type="number" value={it.quantidadeItem} onChange={(e) => updateItem(idx, { quantidadeItem: Number(e.target.value) })} min={1} />
                  </div>
                  <div className="field">
                    <label>Preço</label>
                    <input className="input" type="number" value={it.valorItem} onChange={(e) => updateItem(idx, { valorItem: Number(e.target.value) })} min={0} />
                  </div>
                  <div className="actions" style={{ gridColumn: '1 / -1' }}>
                    <button type="button" className="btn btn-outline" onClick={addItem}>Adicionar item</button>
                    <button type="button" className="btn btn-danger" onClick={() => removeItem(idx)} disabled={items.length === 1}>Remover item</button>
                  </div>
                </div>
              ))}

              <div className="actions">
                <button className="btn btn-primary" type="submit">Criar pedido</button>
              </div>
              {error && <div className="muted" style={{ marginTop: 10, color: 'var(--danger)' }}>Erro: {error}</div>}
            </form>
          </div>
        </section>

        <section className="card">
          <div className="card-header">
            <h2 className="title">Pedidos</h2>
            <span className="muted">Listagem dos pedidos cadastrados</span>
          </div>
          <div className="card-body">
            <div className="row" style={{ marginBottom: 12 }}>
              <div className="field" style={{ gridColumn: '1 / -1' }}>
                <label>Buscar por número ou ID do produto</label>
                <input className="input" placeholder="Ex.: v10089016vdb ou 2434" value={query} onChange={(e) => setQuery(e.target.value)} />
              </div>
            </div>
            {loading ? (
              <div className="empty">Carregando...</div>
            ) : orders.filter((o) => {
              const text = `${o.orderId} ${o.items?.map((it) => it.productId).join(' ')}`.toLowerCase()
              return text.includes(query.toLowerCase())
            }).length === 0 ? (
              <div className="empty">Nenhum pedido encontrado</div>
            ) : (
              <table className="table">
                <thead>
                  <tr>
                    <th>Pedido</th>
                    <th>Valor</th>
                    <th>Data</th>
                    <th>Itens</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.filter((o) => {
                    const text = `${o.orderId} ${o.items?.map((it) => it.productId).join(' ')}`.toLowerCase()
                    return text.includes(query.toLowerCase())
                  }).map((o) => (
                    <tr key={o.orderId}>
                      <td>{o.orderId}</td>
                      <td>R$ {Number(o.value).toFixed(2)}</td>
                      <td>{new Date(o.creationDate).toLocaleString('pt-BR')}</td>
                      <td>
                        {o.items?.map((it, i) => (
                          <span key={i} className="chip" style={{ marginRight: 6 }}>
                            {it.productId} × {it.quantity} — R$ {it.price}
                          </span>
                        ))}
                      </td>
                      <td>
                        <div className="actions">
                          <button className="btn btn-outline" onClick={() => router.push(`/pedidos/${o.orderId}`)}>Modificar</button>
                          <button className="btn btn-danger" onClick={async () => {
                            try {
                              const r = await fetch(`/order/${o.orderId}`, { method: 'DELETE' })
                              if (!r.ok) throw new Error(`HTTP ${r.status}`)
                              showToast(`Pedido removido: ${o.orderId}`)
                              loadOrders()
                            } catch (e) { setError(e.message) }
                          }}>Excluir</button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </section>
      </div>
    </main>
  )
}
