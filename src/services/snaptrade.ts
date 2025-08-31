// SnapTrade service using our proxy server to avoid CORS issues
const clientId = import.meta.env.VITE_SNAPTRADE_CLIENT_ID
const consumerKey = import.meta.env.VITE_SNAPTRADE_CONSUMER_KEY

if (!clientId || !consumerKey) {
  throw new Error('Missing SnapTrade environment variables')
}

export interface SnapTradeAuthResponse {
  userSecret: string
  redirectURI?: string
  sessionId?: string
}

// Use our proxy server to avoid CORS issues
const PROXY_BASE_URL = 'http://localhost:3001/api/snaptrade'

export const registerUser = async (userId: string): Promise<SnapTradeAuthResponse> => {
  try {
    console.log('🔐 Registering SnapTrade user:', userId)
    
    const response = await fetch(`${PROXY_BASE_URL}/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ userId })
    })
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }
    
    const data = await response.json()
    
    if (!data.userSecret) {
      throw new Error('No userSecret received from SnapTrade')
    }
    
    console.log('✅ User registered successfully')
    return { userSecret: data.userSecret }
  } catch (error) {
    console.error('❌ Error registering user:', error)
    throw error
  }
}

export const loginUser = async (userId: string, userSecret: string): Promise<SnapTradeAuthResponse> => {
  try {
    console.log('🔑 Logging in SnapTrade user:', userId)
    
    const response = await fetch(`${PROXY_BASE_URL}/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ userId, userSecret })
    })
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }
    
    const data = await response.json()
    
    console.log('✅ User logged in successfully')
    return {
      userSecret,
      redirectURI: data.redirectURI,
      sessionId: data.sessionId
    }
  } catch (error) {
    console.error('❌ Error logging in user:', error)
    throw error
  }
}

export const generateConnectionPortalUrl = async (userId: string, userSecret: string): Promise<string> => {
  try {
    console.log('🔗 Generating connection portal URL for:', userId)
    
    // First login to get session
    const loginResponse = await loginUser(userId, userSecret)
    
    if (!loginResponse.redirectURI) {
      throw new Error('No redirect URI received from SnapTrade')
    }
    
    console.log('✅ Connection portal URL generated')
    return loginResponse.redirectURI
  } catch (error) {
    console.error('❌ Error generating connection portal URL:', error)
    throw error
  }
}

