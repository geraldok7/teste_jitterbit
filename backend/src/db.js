import { MongoClient } from 'mongodb'

const mongoUrl = process.env.MONGO_URL || 'mongodb://localhost:27017'
const dbName = process.env.MONGO_DB || 'ordersdb'

let client
let db

export async function connect() {
  if (db) return db
  client = new MongoClient(mongoUrl)
  await client.connect()
  db = client.db(dbName)
  const orders = db.collection('orders')
  await orders.createIndex({ orderId: 1 }, { unique: true })
  return db
}

export function getDb() {
  if (!db) throw new Error('Database not initialized')
  return db
}

export async function close() {
  if (client) await client.close()
  client = undefined
  db = undefined
}

