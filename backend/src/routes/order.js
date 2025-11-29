import { Router } from 'express'
import { getDb } from '../db.js'

function transformInput(input) {
  const numeroPedido = input?.numeroPedido
  const valorTotal = input?.valorTotal
  const dataCriacao = input?.dataCriacao
  const items = Array.isArray(input?.items) ? input.items : []

  if (!numeroPedido || typeof numeroPedido !== 'string') {
    return { error: 'numeroPedido inválido ou ausente' }
  }
  if (typeof valorTotal !== 'number') {
    return { error: 'valorTotal inválido ou ausente' }
  }
  if (!dataCriacao || typeof dataCriacao !== 'string') {
    return { error: 'dataCriacao inválida ou ausente' }
  }
  if (!Array.isArray(items) || items.length === 0) {
    return { error: 'items inválido ou ausente' }
  }

  let date
  try {
    date = new Date(dataCriacao)
    if (isNaN(date.getTime())) throw new Error('invalid date')
  } catch {
    return { error: 'dataCriacao não é uma data válida' }
  }

  const transformedItems = []
  for (const it of items) {
    const idItem = it?.idItem
    const quantidadeItem = it?.quantidadeItem
    const valorItem = it?.valorItem
    const productId = typeof idItem === 'string' ? parseInt(idItem, 10) : idItem
    if (!Number.isInteger(productId)) return { error: 'idItem inválido' }
    if (!Number.isInteger(quantidadeItem) || quantidadeItem < 1) return { error: 'quantidadeItem inválida' }
    if (typeof valorItem !== 'number') return { error: 'valorItem inválido' }
    transformedItems.push({ productId, quantity: quantidadeItem, price: valorItem })
  }

  const orderId = numeroPedido.split('-')[0]
  return {
    orderId,
    value: valorTotal,
    creationDate: new Date(date.toISOString()),
    items: transformedItems
  }
}

const router = Router()

router.post('/order', async (req, res) => {
  try {
    const payload = transformInput(req.body)
    if (payload?.error) return res.status(400).json({ message: payload.error })
    const db = getDb()
    const orders = db.collection('orders')
    const exists = await orders.findOne({ orderId: payload.orderId })
    if (exists) return res.status(409).json({ message: 'Pedido já existe' })
    await orders.insertOne(payload)
    return res.status(201).json(payload)
  } catch (e) {
    return res.status(500).json({ message: 'Erro interno', details: e.message })
  }
})

router.get('/order/list', async (req, res) => {
  try {
    const db = getDb()
    const orders = db.collection('orders')
    const list = await orders.find({}).sort({ creationDate: -1 }).toArray()
    return res.status(200).json(list)
  } catch (e) {
    return res.status(500).json({ message: 'Erro interno', details: e.message })
  }
})

router.get('/order/:orderId', async (req, res) => {
  try {
    const { orderId } = req.params
    const db = getDb()
    const orders = db.collection('orders')
    const order = await orders.findOne({ orderId })
    if (!order) return res.status(404).json({ message: 'Pedido não encontrado' })
    return res.status(200).json(order)
  } catch (e) {
    return res.status(500).json({ message: 'Erro interno', details: e.message })
  }
})

router.put('/order/:orderId', async (req, res) => {
  try {
    const { orderId } = req.params
    const payload = transformInput(req.body)
    if (payload?.error) return res.status(400).json({ message: payload.error })
    if (payload.orderId !== orderId) return res.status(400).json({ message: 'orderId do corpo difere do parâmetro' })
    const db = getDb()
    const orders = db.collection('orders')
    const result = await orders.updateOne({ orderId }, { $set: payload })
    if (result.matchedCount === 0) return res.status(404).json({ message: 'Pedido não encontrado' })
    const updated = await orders.findOne({ orderId })
    return res.status(200).json(updated)
  } catch (e) {
    return res.status(500).json({ message: 'Erro interno', details: e.message })
  }
})

router.delete('/order/:orderId', async (req, res) => {
  try {
    const { orderId } = req.params
    const db = getDb()
    const orders = db.collection('orders')
    const result = await orders.deleteOne({ orderId })
    if (result.deletedCount === 0) return res.status(404).json({ message: 'Pedido não encontrado' })
    return res.status(204).send()
  } catch (e) {
    return res.status(500).json({ message: 'Erro interno', details: e.message })
  }
})

export default router
