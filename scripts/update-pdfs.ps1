# 사이트 수정 후 PDF 재생성
# Usage: powershell -File scripts/update-pdfs.ps1

$ErrorActionPreference = "Stop"
Set-Location $PSScriptRoot\..
if (-not (Test-Path "node_modules\playwright")) {
  npm install
  npx playwright install chromium
}
npm run pdf
Write-Host "PDFs updated under pdf/"
