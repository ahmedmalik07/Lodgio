# PowerShell script to activate virtual environment and run API server
# Run this with: .\start_api_server.ps1

Write-Host "🚀 Starting RoomMate Matcher API Server with Virtual Environment" -ForegroundColor Green
Write-Host "=" * 70 -ForegroundColor Yellow

# Check if virtual environment is already active
if ($env:VIRTUAL_ENV) {
    Write-Host "✅ Virtual environment already active: $env:VIRTUAL_ENV" -ForegroundColor Green
} else {
    # Activate virtual environment
    Write-Host "📦 Activating virtual environment..." -ForegroundColor Cyan
    & .\.venv\Scripts\Activate.ps1

    if ($LASTEXITCODE -ne 0) {
        Write-Host "❌ Failed to activate virtual environment" -ForegroundColor Red
        Write-Host "🔧 Make sure you have created the virtual environment:" -ForegroundColor Yellow
        Write-Host "   python -m venv .venv" -ForegroundColor White
        Write-Host "   .\.venv\Scripts\Activate.ps1" -ForegroundColor White
        Write-Host "   pip install -r requirements.txt" -ForegroundColor White
        exit 1
    }

    Write-Host "✅ Virtual environment activated" -ForegroundColor Green
}

# Change to frontend directory
Write-Host "📁 Changing to frontend directory..." -ForegroundColor Cyan
Set-Location "frontend"

# Start the API server
Write-Host "🌐 Starting API server..." -ForegroundColor Cyan
Write-Host "Server will be available at: http://localhost:8000" -ForegroundColor Yellow
Write-Host "Press Ctrl+C to stop the server" -ForegroundColor Yellow
Write-Host ""

python api_server.py