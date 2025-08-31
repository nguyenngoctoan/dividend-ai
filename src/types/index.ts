export interface User {
  id: string
  email: string
  name?: string
  createdAt: string
  updatedAt: string
}

export interface SnapTradeCredentials {
  userId: string
  userSecret: string
  accessToken?: string
  refreshToken?: string
  expiresAt?: string
  createdAt: string
  updatedAt: string
}

export interface BrokerConnection {
  id: string
  userId: string
  brokerageName: string
  accountId: string
  accountType: string
  isConnected: boolean
  lastSyncAt?: string
  createdAt: string
  updatedAt: string
}

export interface Portfolio {
  id: string
  userId: string
  name: string
  accountId: string
  accountType: string
  totalValue: number
  cashValue: number
  investedValue: number
  lastUpdated: string
  stocks: Stock[]
}

export interface Stock {
  id: string
  symbol: string
  name: string
  quantity: number
  currentPrice: number
  totalValue: number
  costBasis: number
  unrealizedGainLoss: number
  unrealizedGainLossPercent: number
  sector?: string
  lastUpdated: string
}

export interface SnapTradeAuthResponse {
  redirectURI: string
  userSecret: string
  userId: string
}

export interface SnapTradeAccount {
  id: string
  name: string
  type: string
  institution: string
}

export interface SnapTradeHoldings {
  accountId: string
  holdings: any[]
}

export interface ApiResponse<T> {
  data?: T
  error?: string
}

export interface LoadingState {
  isLoading: boolean
  error: string | null
}
