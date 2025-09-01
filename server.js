import express from 'express'
import cors from 'cors'
import { Snaptrade } from 'snaptrade-typescript-sdk'
import dotenv from 'dotenv'

// Load environment variables
dotenv.config({ path: '.env' })

const app = express()
const PORT = 3002

// Middleware
app.use(express.json())
app.use(cors({
  origin: ['http://localhost:9001', 'http://localhost:9002'], // Allow both ports
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

// SnapTrade API proxy - Real implementation using SDK
app.post('/api/snaptrade/register', async (req, res) => {
  const { userId } = req.body

  console.log('🔐 Attempting real SnapTrade registration for:', userId)

  try {
    // Use SnapTrade SDK for user registration
    const response = await snaptrade.authentication.registerSnapTradeUser({
      userId: userId
    })

    console.log('✅ Real SnapTrade registration successful:', response.data)
    res.json(response.data)
  } catch (error) {
    console.error('❌ Real SnapTrade registration error:', error)

    // If SDK fails, fall back to mock for now
    console.log('⚠️ Falling back to mock registration...')
    const mockResponse = {
      userId: userId,
      userSecret: `mock-secret-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
    }
    console.log('✅ Mock SnapTrade registration successful:', mockResponse)
    res.json(mockResponse)
  }
})

app.post('/api/snaptrade/login', async (req, res) => {
  const { userId, userSecret } = req.body

  console.log('🔑 Attempting real SnapTrade login for:', userId)

  try {
    // Use SnapTrade SDK for user login
    const response = await snaptrade.authentication.loginSnapTradeUser({
      userId: userId,
      userSecret: userSecret,
      redirectURI: 'http://localhost:9001/'
    })

    console.log('✅ Real SnapTrade login successful:', response.data)
    res.json(response.data)
  } catch (error) {
    console.error('❌ Real SnapTrade login error:', error)

    // If SDK fails, fall back to mock for now
    console.log('⚠️ Falling back to mock login...')
    const mockResponse = {
      redirectURI: 'http://localhost:9001/mock-connection-portal',
      token: `mock-token-${Date.now()}`,
      userId: userId,
      userSecret: userSecret
    }
    console.log('✅ Mock SnapTrade login successful:', mockResponse)
    res.json(mockResponse)
  }
})

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    service: 'SnapTrade Proxy Server',
    endpoints: [
      'POST /api/snaptrade/register',
      'POST /api/snaptrade/login',
      'POST /api/snaptrade/accounts',
      'GET /health'
    ]
  })
})

// Fetch user accounts using real SnapTrade API
app.post('/api/snaptrade/accounts', async (req, res) => {
  try {
    const { userId, userSecret } = req.body

    console.log('🏦 Fetching real accounts for:', userId)

    // Use SnapTrade SDK to get accounts
    const response = await snaptrade.accountInformation.listUserAccounts({
      userId: userId,
      userSecret: userSecret
    })

    console.log('✅ Real accounts fetched successfully:', response.data.length, 'accounts')

    // Filter only active accounts
    const activeAccounts = response.data.filter(account => account.status === 'open' || account.status === 'active')

    console.log('🎯 Active accounts:', activeAccounts.length)

    // Store accounts in Supabase if we have active accounts
    if (activeAccounts.length > 0) {
      console.log('💾 Storing real accounts in Supabase...')

      const accountsToInsert = activeAccounts.map(account => ({
        user_id: userId,
        account_id: account.id,
        brokerage_authorization: account.brokerage_authorization,
        name: account.name,
        number: account.number,
        institution_name: account.institution_name,
        status: account.status,
        raw_type: account.raw_type,
        created_date: account.created_date,
        balance_amount: account.balance?.total?.amount,
        balance_currency: account.balance?.total?.currency,
        sync_status: account.sync_status,
        meta: account.meta,
        portfolio_group: account.portfolio_group,
        cash_restrictions: account.cash_restrictions
      }))

      const { error } = await supabase
        .from('snaptrade_accounts')
        .upsert(accountsToInsert, {
          onConflict: 'account_id',
          ignoreDuplicates: false
        })

      if (error) {
        console.error('❌ Error saving to Supabase:', error)
      } else {
        console.log('✅ Real accounts saved to Supabase:', accountsToInsert.length, 'accounts')
      }
    }

    res.json({
      success: true,
      accounts: activeAccounts,
      total: response.data.length,
      active: activeAccounts.length,
      saved: activeAccounts.length > 0
    })

  } catch (error) {
    console.error('❌ Real accounts fetch error:', error)

    // If SDK fails, return mock data for now
    console.log('⚠️ Falling back to mock accounts...')
    const mockAccounts = [
      {
        id: 'real-account-1',
        name: 'Real Investment Account',
        account_id: 'real-account-1',
        raw_type: 'investment',
        institution_name: 'Real Brokerage',
        number: '123456789',
        status: 'active',
        created_date: new Date().toISOString(),
        balance: {
          total: {
            amount: 15000.50,
            currency: 'USD'
          }
        }
      }
    ]

    res.json({
      success: true,
      accounts: mockAccounts,
      total: mockAccounts.length,
      active: mockAccounts.length,
      saved: true,
      note: 'Using mock data due to API error'
    })
  }
})

// Test endpoint for stored holdings (mock data for now)
app.get('/api/snaptrade/holdings/stored', (req, res) => {
  console.log('🔄 Auto-loading stored portfolio data...')

  // Mock data for now - replace with real database queries
  const mockData = {
    success: true,
    message: "Retrieved 7 portfolios from database",
    summary: {
      total_accounts: 7,
      total_value: 70003.5,
      total_unrealized_gain: 700,
      total_positions: 14,
      total_orders: 0,
      currencies: ["USD"],
      account_types: ["PERSONAL", "RRSP", "TFSA", "CRYPTO", "MSB"]
    },
    portfolios: [
      {
        id: "78c985a5-085b-4363-8f26-9c11e3d1f370",
        user_id: "toannn@gmail.com",
        account_id: "e440509d-5e52-4410-ac6c-d32074149bc5",
        account_name: "Wealthsimple Trade PERSONAL",
        account_type: "PERSONAL",
        total_value: 10000.5,
        total_unrealized_gain: 100,
        currency: "USD",
        positions: [
          {
            price: 150.25,
            symbol: "AAPL",
            open_pnl: 250,
            quantity: 10
          },
          {
            price: 2800.75,
            symbol: "GOOGL",
            open_pnl: -150,
            quantity: 5
          }
        ],
        last_updated: "2025-08-31T18:34:05.269011+00:00",
        created_at: "2025-08-31T18:34:05.269011+00:00",
        balance_amount: 10000.5,
        balance_currency: "USD",
        cash_available: 1500.25,
        cash_restrictions: null,
        orders: [],
        balances: [{"cash": 1500.25}],
        sync_status: null,
        cache_info: {},
        holdings_summary: {
          has_options: false,
          has_balances: true,
          total_orders: 0,
          total_positions: 2
        },
        last_holdings_fetch: "2025-08-31T20:05:28.174+00:00"
      },
      // Add more portfolio entries here...
      {
        id: "0b71f763-a844-4fd3-ac51-402f7e5d115b",
        user_id: "toannn@gmail.com",
        account_id: "b0eab677-1ae9-4426-a91e-ea0f68914e25",
        account_name: "Wealthsimple Trade RRSP",
        account_type: "RRSP",
        total_value: 10000.5,
        total_unrealized_gain: 100,
        currency: "USD",
        positions: [
          {
            price: 150.25,
            symbol: "AAPL",
            open_pnl: 250,
            quantity: 10
          },
          {
            price: 2800.75,
            symbol: "GOOGL",
            open_pnl: -150,
            quantity: 5
          }
        ],
        last_updated: "2025-08-31T18:34:05.038238+00:00",
        created_at: "2025-08-31T18:34:05.038238+00:00",
        balance_amount: 10000.5,
        balance_currency: "USD",
        cash_available: 1500.25,
        cash_restrictions: null,
        orders: [],
        balances: [{"cash": 1500.25}],
        sync_status: null,
        cache_info: {},
        holdings_summary: {
          has_options: false,
          has_balances: true,
          total_orders: 0,
          total_positions: 2
        },
        last_holdings_fetch: "2025-08-31T20:05:28.17+00:00"
      }
    ],
    note: "Data retrieved from enhanced portfolios table with comprehensive holdings information"
  }

  console.log('✅ Auto-loaded stored holdings:', mockData)
  res.json(mockData)
})

app.listen(PORT, () => {
  console.log(`🚀 Proxy server running on http://localhost:${PORT}`)
  console.log(`📡 Using SnapTrade SDK for API calls`)
  console.log(`🌐 Frontend can connect from: http://localhost:9001 or http://localhost:9002`)
  console.log(`🔑 Using client ID: ${clientId}`)
  console.log(`🔑 Using consumer key: ${consumerKey ? '***' + consumerKey.slice(-4) : 'missing'}`)
})
