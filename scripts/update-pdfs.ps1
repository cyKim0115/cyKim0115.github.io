# 사이트 수정 후 PDF 재생성
# Usage: powershell -File scripts/update-pdfs.ps1
# 브라우저는 Playwright Chromium → 시스템 Chrome → 시스템 Edge 순서로 찾는다 (scripts/browser.mjs).
# 셋 다 없을 때만 `npx playwright install chromium` 을 실행한다.

$ErrorActionPreference = "Stop"
Set-Location $PSScriptRoot\..
if (-not (Test-Path "node_modules\playwright")) {
  npm install
}
npm run pdf
Write-Host "PDFs updated under pdf/"
