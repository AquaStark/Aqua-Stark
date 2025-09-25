Write-Host "🚀 Iniciando commits masivos para Issue #432..." -ForegroundColor Green

git add client/src/types/index.ts
git commit -m "feat: create centralized types index file with organized exports"

git add client/src/components/market/fish-card.tsx
git commit -m "refactor: update imports to use centralized types index"

git add client/src/components/market/filter-panel.tsx
git commit -m "refactor: update imports to use centralized types index"

# ... (continuar con todos los archivos)

Write-Host "✅ Todos los commits completados!" -ForegroundColor Green
