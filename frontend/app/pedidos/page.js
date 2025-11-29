'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'

export default function PedidosPage() {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [query, setQuery] = useState('')
  const [toast, setToast] = useState('')

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
    } finally { setLoading(false) }
  }

  useEffect(() => { loadOrders() }, [])

  async function onDelete(orderId) {
    setError('')
    try {
      const r = await fetch(`/order/${orderId}`, { method: 'DELETE' })
      if (!r.ok) throw new Error(`HTTP ${r.status}`)
      showToast(`Pedido removido: ${orderId}`)
      loadOrders()
    } catch (e) { setError(e.message) }
  }

  return (
    <div>
      {toast && <div className="toast">{toast}</div>}
      <div className="header">
        <div>
          <h1>Pedidos</h1>
          <div className="subtitle">Listagem completa com ações</div>
        </div>
      </div>

      <section className="card">
        <div className="card-header">
          <h2 className="title">Lista</h2>
          <span className="muted">Total: {orders.length}</span>
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
                  <th>Ações</th>
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
                        <Link className="btn btn-outline" href={`/pedidos/${o.orderId}`}>Modificar</Link>
                        <button className="btn btn-danger" onClick={() => onDelete(o.orderId)}>Excluir</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
          {error && <div className="muted" style={{ marginTop: 10, color: 'var(--danger)' }}>Erro: {error}</div>}
        </div>
      </section>
    </div>
  )
}

