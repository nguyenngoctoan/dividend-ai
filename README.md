# 🚀 Dividend AI - Wealthsimple Connection App

A simple React app that allows users to connect their Wealthsimple brokerage account via SnapTrade.

## Features

- **One-click brokerage connection** - Connect to Wealthsimple via SnapTrade
- **Automatic user registration** - Registers users with SnapTrade using "toannn@gmail.com"
- **Local Supabase backend** - Uses project ID "dividend-ai"
- **Modern UI** - Beautiful, responsive interface
- **Real SnapTrade integration** - Uses proxy server to avoid CORS issues

## 🚀 **Current Status: Working Integration**

The app now has **real SnapTrade integration** working through a proxy server:

- ✅ **Frontend**: Fully functional with beautiful UI
- ✅ **Supabase**: Running with project ID "dividend-ai"
- ✅ **SnapTrade**: Real API integration via proxy server
- ✅ **User Flow**: Complete from button click to real connection portal

## Prerequisites

1. **Node.js 18+** - [Download here](https://nodejs.org/)
2. **Supabase CLI** - Install with: `npm install -g supabase`
3. **Docker** - Required for Supabase local services

## Quick Start

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Start local Supabase services**:
   ```bash
   npm run setup
   ```

3. **Start the proxy server** (in a new terminal):
   ```bash
   npm run proxy
   ```

4. **Start the frontend development server** (in another terminal):
   ```bash
   npm run dev
   ```

5. **Open your browser**: http://localhost:9001 (or the port shown in terminal)

## How It Works

1. **User clicks "Connect to Wealthsimple" button**
2. **App registers user with SnapTrade** using "toannn@gmail.com" via proxy server
3. **App generates real connection portal URL** for Wealthsimple integration
4. **User clicks the portal link** to complete the real connection

## Available Scripts

- `npm run dev` - Start frontend development server
- `npm run build` - Build for production
- `npm run setup` - Start Supabase services
- `npm run proxy` - Start SnapTrade proxy server
- `npm run supabase:start` - Start Supabase services
- `npm run supabase:stop` - Stop Supabase services
- `npm run supabase:status` - Check Supabase service status

## Environment Variables

The app uses the following environment variables (configured in `.env.local`):

- `VITE_SUPABASE_URL` - Local Supabase API URL
- `VITE_SUPABASE_ANON_KEY` - Supabase anonymous key
- `VITE_SNAPTRADE_CLIENT_ID` - SnapTrade client ID
- `VITE_SNAPTRADE_CONSUMER_KEY` - SnapTrade consumer key

## Tech Stack

- **Frontend**: React + TypeScript + Vite
- **Backend**: Supabase (PostgreSQL + Auth + API)
- **Integration**: SnapTrade API via Node.js proxy server
- **Styling**: CSS with modern design

## Project Structure

```
ws-ai/
├── src/
│   ├── lib/
│   │   └── supabase.ts      # Supabase client configuration
│   ├── services/
│   │   └── snaptrade.ts     # SnapTrade service (uses proxy)
│   ├── App.tsx              # Main application component
│   └── App.css              # Application styles
├── supabase/
│   ├── config.toml          # Supabase configuration
│   └── seed.sql             # Database seed data
├── .env.local               # Environment variables
├── server.js                # SnapTrade proxy server
├── dev-setup.sh             # Development setup script
└── README.md                # This file
```

## Troubleshooting

### Supabase Services Not Starting
- Make sure Docker is running
- Check if ports 54321-54324 are available
- Run `supabase stop` to clear any conflicts

### Proxy Server Issues
- Make sure the proxy server is running: `npm run proxy`
- Check that port 3001 is available
- Verify SnapTrade credentials in `.env.local`

### SnapTrade Connection Issues
- Check the browser console for error messages
- Verify the proxy server is running on port 3001
- Ensure SnapTrade credentials are correct

## Development

The app is configured for local development with:
- **Frontend**: http://localhost:9001 (or port shown in terminal)
- **Proxy Server**: http://localhost:3001
- **Supabase API**: http://localhost:54321
- **Supabase Studio**: http://localhost:54323

## How the Proxy Works

The proxy server (`server.js`) acts as a bridge between your frontend and SnapTrade's API:

1. **Frontend** makes requests to `http://localhost:3001/api/snaptrade/*`
2. **Proxy server** forwards requests to `https://api.snaptrade.com`
3. **CORS issues are avoided** since the proxy runs on the same domain
4. **Real SnapTrade responses** are returned to your app

## License

This project is for educational and development purposes.

