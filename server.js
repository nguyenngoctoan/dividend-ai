import express from 'express'
import cors from 'cors'
import { Snaptrade } from 'snaptrade-typescript-sdk'
import dotenv from 'dotenv'

// Load environment variables
dotenv.config({ path: '.env.local' })

const app = express()
const PORT = 3001

// Middleware
app.use(express.json())
app.use(cors({
  origin: 'http://localhost:9002', // Updated to match your current port
  credentials: true
}))

// Initialize SnapTrade SDK
const clientId = process.env.VITE_SNAPTRADE_CLIENT_ID || 'MY-ORG-TEST-LWFXD'
const consumerKey = process.env.VITE_SNAPTRADE_CONSUMER_KEY || 'hEOBJ8yEdqFxg61hs3LNWNIf0OxRyeeYLs4cV8ijMVMd1H81BY'

const snaptrade = new Snaptrade({
  clientId,
  consumerKey,
})

console.log('🔧 SnapTrade SDK initialized with:', { clientId, consumerKey: consumerKey ? '***' + consumerKey.slice(-4) : 'missing' })

// SnapTrade API proxy using SDK
app.post('/api/snaptrade/register', async (req, res) => {
  try {
    const { userId } = req.body
    
    console.log('🔐 Attempting SnapTrade registration with SDK for:', userId)
    
    const response = await snaptrade.authentication.registerSnapTradeUser({ userId })
    
    console.log('✅ SnapTrade registration successful:', response.data)
    res.json(response.data)
  } catch (error) {
    console.error('SnapTrade registration error:', error)
    res.status(500).json({ error: error.message })
  }
})

app.post('/api/snaptrade/login', async (req, res) => {
  try {
    const { userId, userSecret } = req.body
    
    console.log('🔑 Attempting SnapTrade login with SDK for:', userId)
    
    const response = await snaptrade.authentication.loginSnapTradeUser({ userId, userSecret })
    
    console.log('✅ SnapTrade login successful:', response.data)
    res.json(response.data)
  } catch (error) {
    console.error('SnapTrade login error:', error)
    res.status(500).json({ error: error.message })
  }
})

app.listen(PORT, () => {
  console.log(`🚀 Proxy server running on http://localhost:${PORT}`)
  console.log(`📡 Using SnapTrade SDK for API calls`)
  console.log(`🌐 Frontend should connect to: http://localhost:9002`)
  console.log(`🔑 Using client ID: ${clientId}`)
  console.log(`🔑 Using consumer key: ${consumerKey ? '***' + consumerKey.slice(-4) : 'missing'}`)
})
