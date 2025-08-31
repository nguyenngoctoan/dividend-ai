#!/bin/bash

echo "🚀 Setting up local development environment..."

# Check if Supabase CLI is installed
if ! command -v supabase &> /dev/null; then
    echo "❌ Supabase CLI not found. Please install it first:"
    echo "   npm install -g supabase"
    echo "   or visit: https://supabase.com/docs/guides/cli"
    exit 1
fi

# Start Supabase services
echo "📦 Starting Supabase services..."
supabase start

# Wait a moment for services to be ready
echo "⏳ Waiting for services to be ready..."
sleep 5

# Check if services are running
if curl -s http://localhost:54321/health > /dev/null; then
    echo "✅ Supabase services are running!"
    echo "   - API: http://localhost:54321"
    echo "   - Studio: http://localhost:54323"
    echo "   - Database: localhost:5432"
else
    echo "❌ Supabase services failed to start properly"
    exit 1
fi

echo ""
echo "🎉 Local development environment is ready!"
echo ""
echo "📱 To start the frontend development server:"
echo "   npm run dev"
echo ""
echo "🌐 Your app will be available at:"
echo "   - Frontend: http://localhost:9001"
echo "   - Supabase Studio: http://localhost:54323"
echo ""
echo "🛑 To stop Supabase services:"
echo "   npm run supabase:stop"
