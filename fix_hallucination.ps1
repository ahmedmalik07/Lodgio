# PowerShell script to fix hallucination by uploading real data
# Run this with: .\fix_hallucination.ps1

Write-Host "🔧 Fixing Agent Hallucination Issue" -ForegroundColor Red
Write-Host "=" * 50 -ForegroundColor Yellow

Write-Host "❌ Current Problem:" -ForegroundColor Red
Write-Host "   Agent is making up fake profiles like 'Fatima Ali (R-156)'" -ForegroundColor White
Write-Host "   Real R-156 is: 'Flat share in Cantt, Multan, 16k budget'" -ForegroundColor White
Write-Host ""
Write-Host "✅ Solution:" -ForegroundColor Green  
Write-Host "   Upload real profiles from your JSON files to Supabase" -ForegroundColor White
Write-Host "   Agent will use actual data instead of hallucinating" -ForegroundColor White
Write-Host ""

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
        exit 1
    }
    
    Write-Host "✅ Virtual environment activated" -ForegroundColor Green
}

# Run the fix
Write-Host "🚀 Running hallucination fix..." -ForegroundColor Cyan
python fix_hallucination.py

Write-Host ""
Write-Host "🎯 After this completes:" -ForegroundColor Yellow
Write-Host "1. Restart your API server: .\start_api_server.ps1" -ForegroundColor White
Write-Host "2. Test roommate matching again" -ForegroundColor White
Write-Host "3. Agent should use real profiles now!" -ForegroundColor White