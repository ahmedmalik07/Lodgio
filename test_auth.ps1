# PowerShell script to activate virtual environment and run authentication test
# Run this with: .\test_auth.ps1

Write-Host "🧪 Testing Google OAuth Authentication" -ForegroundColor Green
Write-Host "=" * 50 -ForegroundColor Yellow

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

# Run the authentication test
Write-Host "🧪 Running authentication test..." -ForegroundColor Cyan
python test_google_auth.py

Write-Host ""
Write-Host "🎯 Next steps if test passes:" -ForegroundColor Yellow
Write-Host "1. Open browser to: http://localhost:3000" -ForegroundColor White
Write-Host "2. Click 'Sign Up with Google' or 'Sign In with Google'" -ForegroundColor White  
Write-Host "3. Complete Google OAuth flow" -ForegroundColor White
Write-Host "4. Should redirect to dashboard" -ForegroundColor White