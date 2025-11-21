$ErrorActionPreference = 'Stop'
$base = 'http://localhost:5000/api'
$global:fail = $false

function Test-Get($path) {
    Write-Host "\n== GET $path =="
    try {
        $resp = Invoke-RestMethod -Method GET -Uri ($base + $path) -TimeoutSec 10
        Write-Host "OK:"
        $resp | ConvertTo-Json -Depth 4 | Write-Host
    } catch {
        Write-Host "FAIL: $_"
        $global:fail = $true
    }
}

Write-Host "Starting smoke tests against $base"
Test-Get '/health'
Test-Get '/parts'
Test-Get '/parts/search?query=test'

if ($global:fail) {
    Write-Host "\nOne or more smoke tests failed."; exit 2
} else {
    Write-Host "\nAll smoke tests passed."; exit 0
}
