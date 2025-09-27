# PowerShell script to activate virtual environment and run frontend
# Run this with: .\start_frontend.ps1

Write-Host "🎨 Starting RoomMate Matcher Frontend" -ForegroundColor Green
Write-Host "=" * 50 -ForegroundColor Yellow

# Change to frontend directory
Write-Host "📁 Changing to frontend directory..." -ForegroundColor Cyan
Set-Location "frontend"

# Check if node_modules exists
if (-not (Test-Path "node_modules")) {
    Write-Host "📦 Installing Node.js dependencies..." -ForegroundColor Cyan
    npm install
    if ($LASTEXITCODE -ne 0) {
        Write-Host "❌ Failed to install dependencies" -ForegroundColor Red
        exit 1
    }
    Write-Host "✅ Dependencies installed" -ForegroundColor Green
}

# Start the frontend
Write-Host "🌐 Starting frontend development server..." -ForegroundColor Cyan
Write-Host "Frontend will be available at: http://localhost:3000" -ForegroundColor Yellow
Write-Host "Press Ctrl+C to stop the server" -ForegroundColor Yellow
Write-Host ""

npm run dev