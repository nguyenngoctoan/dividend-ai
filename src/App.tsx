import { useState } from 'react'
import './App.css'

function App() {
  const [isConnecting, setIsConnecting] = useState(false)
  const [connectionStatus, setConnectionStatus] = useState('')
  const [connectionUrl, setConnectionUrl] = useState('')
  const [error, setError] = useState('')
  const [userCredentials, setUserCredentials] = useState<{
    userId: string
    userSecret: string
  } | null>(null)

  const handleConnectBrokerage = async () => {
    setIsConnecting(true)
    setError('')
    setConnectionStatus('')
    setConnectionUrl('')
    setUserCredentials(null)

    try {
      // Register user with SnapTrade
      const response = await fetch('http://localhost:3002/api/snaptrade/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId: 'toannn@gmail.com' })
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const userData = await response.json()
      console.log('✅ User registered successfully')
      
      // Store the user credentials
      setUserCredentials({
        userId: userData.userId,
        userSecret: userData.userSecret
      })

      setConnectionStatus('User registered successfully! Now generating connection portal...')

      // Generate connection portal URL
      const loginResponse = await fetch('http://localhost:3002/api/snaptrade/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: userData.userId,
          userSecret: userData.userSecret
        })
      })

      if (!loginResponse.ok) {
        throw new Error(`HTTP error! status: ${loginResponse.status}`)
      }

      const loginData = await loginResponse.json()
      console.log('✅ User logged in successfully')
      
      setConnectionUrl(loginData.redirectURI)
      setConnectionStatus('Connection portal generated successfully!')
      console.log('✅ Connection portal URL generated')
    } catch (error) {
      console.error('Connection error:', error)
      setError(error instanceof Error ? error.message : 'Unknown error occurred')
    } finally {
      setIsConnecting(false)
    }
  }

  return (
    <div className="App">
      <div className="container">
        <h1>🚀 Dividend AI</h1>
        <p className="subtitle">Connect your Wealthsimple brokerage account</p>
        
        <div className="connection-card">
          <button 
            onClick={handleConnectBrokerage}
            disabled={isConnecting}
            className="connect-button"
          >
            {isConnecting ? '🔄 Connecting...' : '🔗 Connect to Wealthsimple'}
          </button>

          {connectionStatus && (
            <div className="status-message">
              {connectionStatus}
            </div>
          )}

          {error && (
            <div className="error-message">
              ❌ Error: {error}
            </div>
          )}

          {/* Display User Credentials */}
          {userCredentials && (
            <div className="credentials-section">
              <h3>🔑 User Credentials</h3>
              <div className="credential-item">
                <strong>User ID:</strong> 
                <code className="credential-value">{userCredentials.userId}</code>
              </div>
              <div className="credential-item">
                <strong>User Secret:</strong> 
                <code className="credential-value">{userCredentials.userSecret}</code>
              </div>
              <div className="credential-note">
                💡 These credentials are used to authenticate with SnapTrade
              </div>
            </div>
          )}

          {/* Display Connection Portal URL */}
          {connectionUrl && (
            <div className="connection-section">
              <h3>🌐 Connection Portal</h3>
              <p>Click the link below to complete your Wealthsimple connection:</p>
              <a 
                href={connectionUrl} 
                target="_blank" 
                rel="noopener noreferrer"
                className="connection-link"
              >
                🔗 Open Connection Portal
              </a>
              <div className="url-preview">
                <strong>URL Preview:</strong>
                <code className="url-text">{connectionUrl}</code>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default App
