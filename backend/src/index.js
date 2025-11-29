import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import { connect } from './db.js'
import orderRouter from './routes/order.js'

dotenv.config()

const app = express()
app.use(cors())
app.use(express.json({ limit: '1mb' }))

app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok' })
})

app.use('/', orderRouter)

const port = process.env.PORT || 3001

connect()
  .then(() => {
    app.listen(port, () => {
      console.log(`API ouvindo em http://localhost:${port}`)
    })
  })
  .catch((err) => {
    console.error('Falha ao conectar no banco:', err)
    process.exit(1)
  })

