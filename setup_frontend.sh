#!/bin/bash

echo "🚀 Setting up RoomMate Matcher Frontend..."

# Install dependencies
echo "📦 Installing dependencies..."
cd frontend
npm install

# Create environment file
echo "⚙️ Creating environment configuration..."
cat > .env.local << EOL
NEXT_PUBLIC_API_URL=http://localhost:8000
EOL

echo "✅ Setup complete!"
echo ""
echo "🌐 To start the development server:"
echo "   cd frontend && npm run dev"
echo ""
echo "🔗 The application will be available at:"
echo "   http://localhost:3000"
echo ""
echo "📡 Make sure the API server is running:"
echo "   python api_server.py"