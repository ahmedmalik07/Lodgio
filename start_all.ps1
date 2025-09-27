# PowerShell script to start both backend and frontend servers
# Run this with: .\start_all.ps1

Write-Host "🚀 Starting RoomMate Matcher - Full Stack Application" -ForegroundColor Green
Write-Host "=" * 70 -ForegroundColor Yellow

# Function to start backend in new PowerShell window
function Start-Backend {
    Write-Host "🔧 Starting Backend API Server..." -ForegroundColor Cyan
    
    $backendScript = @"
Write-Host "🚀 Backend API Server" -ForegroundColor Green
Set-Location "$PWD"
& .\.venv\Scripts\Activate.ps1
Set-Location "frontend"
Write-Host "🌐 API Server starting at http://localhost:8000" -ForegroundColor Yellow
python api_server.py
"@
    
    Start-Process powershell -ArgumentList "-NoExit", "-Command", $backendScript
}

# Function to start frontend in new PowerShell window  
function Start-Frontend {
    Write-Host "🎨 Starting Frontend Development Server..." -ForegroundColor Cyan
    
    $frontendScript = @"
Write-Host "🎨 Frontend Development Server" -ForegroundColor Green
Set-Location "$PWD\frontend"
Write-Host "🌐 Frontend starting at http://localhost:3000" -ForegroundColor Yellow
npm run dev
"@
    
    Start-Process powershell -ArgumentList "-NoExit", "-Command", $frontendScript
}

# Start both servers
Start-Backend
Start-Sleep -Seconds 2
Start-Frontend

Write-Host ""
Write-Host "✅ Starting both servers in separate windows..." -ForegroundColor Green
Write-Host ""
Write-Host "🌐 URLs:" -ForegroundColor Yellow
Write-Host "   Frontend: http://localhost:3000" -ForegroundColor White
Write-Host "   Backend:  http://localhost:8000" -ForegroundColor White
Write-Host ""
Write-Host "🧪 To test authentication:" -ForegroundColor Yellow
Write-Host "   .\test_auth.ps1" -ForegroundColor White
Write-Host ""
Write-Host "Press any key to exit this script (servers will continue running)..."
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")