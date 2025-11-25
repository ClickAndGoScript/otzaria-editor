@echo off
chcp 65001 >nul
echo.
echo ════════════════════════════════════════════════════════════
echo בדיקת גודל תיקיות
echo ════════════════════════════════════════════════════════════
echo.

echo בודק גדלים...
echo.

powershell -Command "Get-ChildItem -Path . -Directory -Exclude node_modules,.next | ForEach-Object { $size = (Get-ChildItem $_.FullName -Recurse -File -ErrorAction SilentlyContinue | Measure-Object -Property Length -Sum).Sum / 1MB; [PSCustomObject]@{Folder=$_.Name; 'Size(MB)'=[math]::Round($size,2)} } | Sort-Object 'Size(MB)' -Descending | Format-Table -AutoSize"

echo.
echo ════════════════════════════════════════════════════════════
echo קבצים גדולים (מעל 5MB):
echo ════════════════════════════════════════════════════════════
echo.

powershell -Command "Get-ChildItem -Path . -Recurse -File -Exclude node_modules,.next -ErrorAction SilentlyContinue | Where-Object { $_.Length -gt 5MB } | Select-Object @{Name='Size(MB)';Expression={[math]::Round($_.Length/1MB,2)}}, FullName | Sort-Object 'Size(MB)' -Descending | Format-Table -AutoSize"

echo.
pause
