'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'

export default function EditPedidoPage() {
  const params = useParams()
  const router = useRouter()
  const orderId = params.orderId
  const [error, setError] = useState('')
  const [toast, setToast] = useState('')

  const [numeroPedido, setNumeroPedido] = useState('')
  const [valorTotal, setValorTotal] = useState('')
  const [dataCriacao, setDataCriacao] = useState('')
  const [items, setItems] = useState([])

  function showToast(message) {
    setToast(message)
    setTimeout(() => setToast(''), 3000)
  }

  useEffect(() => {
    async function load() {
      setError('')
      try {
        const r = await fetch(`/order/${orderId}`)
        if (!r.ok) throw new Error(`HTTP ${r.status}`)
        const o = await r.json()
        setNumeroPedido(`${o.orderId}-01`)
        setValorTotal(o.value)
        setDataCriacao(new Date(o.creationDate).toISOString())
        setItems(o.items?.map((it) => ({ idItem: String(it.productId), quantidadeItem: it.quantity, valorItem: it.price })) || [])
      } catch (e) { setError(e.message) }
    }
    load()
  }, [orderId])

  function updateItem(index, patch) { setItems((prev) => prev.map((it, i) => (i === index ? { ...it, ...patch } : it))) }
  function addItem() { setItems((prev) => [...prev, { idItem: '', quantidadeItem: 1, valorItem: 0 }]) }
  function removeItem(index) { setItems((prev) => prev.filter((_, i) => i !== index)) }

  async function onSubmit(e) {
    e.preventDefault()
    setError('')
    const body = {
      numeroPedido,
      valorTotal: Number(valorTotal || 0),
      dataCriacao,
      items: items.map((it) => ({ idItem: String(it.idItem || ''), quantidadeItem: Number(it.quantidadeItem || 0), valorItem: Number(it.valorItem || 0) }))
    }
    try {
      const r = await fetch(`/order/${orderId}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) })
      if (!r.ok) {
        const err = await r.json().catch(() => ({}))
        throw new Error(err?.message || `HTTP ${r.status}`)
      }
      showToast('Pedido atualizado')
      router.push('/pedidos')
    } catch (e) { setError(e.message) }
  }

  return (
    <div>
      {toast && <div className="toast">{toast}</div>}
      <div className="header">
        <div>
          <h1>Editar Pedido</h1>
          <div className="subtitle">{orderId}</div>
        </div>
      </div>
      <section className="card">
        <div className="card-header">
          <h2 className="title">Dados</h2>
          <span className="muted">Atualize as informações do pedido</span>
        </div>
        <div className="card-body">
          <form onSubmit={onSubmit}>
            <div className="row">
              <div className="field">
                <label>Número do Pedido</label>
                <input className="input" value={numeroPedido} onChange={(e) => setNumeroPedido(e.target.value)} required />
              </div>
              <div className="field">
                <label>Valor Total</label>
                <input className="input" type="number" value={valorTotal} onChange={(e) => setValorTotal(e.target.value)} min={0} />
              </div>
            </div>
            <div className="row">
              <div className="field">
                <label>Data de Criação</label>
                <input className="input" type="datetime-local" value={dataCriacao ? new Date(dataCriacao).toISOString().slice(0,16) : ''} onChange={(e) => setDataCriacao(new Date(e.target.value).toISOString())} />
              </div>
            </div>
            {items.map((it, idx) => (
              <div key={idx} className="row3" style={{ marginTop: 12 }}>
                <div className="field">
                  <label>ID do Produto</label>
                  <input className="input" value={it.idItem} onChange={(e) => updateItem(idx, { idItem: e.target.value })} />
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
              <button className="btn btn-primary" type="submit">Salvar alterações</button>
            </div>
            {error && <div className="muted" style={{ marginTop: 10, color: 'var(--danger)' }}>Erro: {error}</div>}
          </form>
        </div>
      </section>
    </div>
  )
}

