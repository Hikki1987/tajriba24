@echo off
chcp 65001 >nul
title Tajriba 24 — PDF Fayl Yaratish Dasturi
color 0A
cls

echo ========================================================
echo   TAJRIBA 24 (tajriba24.uz) — SAYTNI PDF GA AYLANTIRISH
echo ========================================================
echo.
echo Iltimos, kuting... Brauzer yordamida yuqori sifatli
echo vektorli PDF fayl tayyorlanmoqda...
echo.

set "OUTPUT_PDF=%~dp0tajriba24-taqdimot.pdf"
set "INPUT_HTML=%~dp0index.html"

rem 1. Chrome orqali PDF qilish
if exist "C:\Program Files\Google\Chrome\Application\chrome.exe" (
    echo [1/3] Google Chrome topildi, PDF yaratilmoqda...
    "C:\Program Files\Google\Chrome\Application\chrome.exe" --headless --disable-gpu --no-pdf-header-footer --print-to-pdf="%OUTPUT_PDF%" "%INPUT_HTML%"
    goto :success
)

if exist "C:\Program Files (x86)\Google\Chrome\Application\chrome.exe" (
    echo [1/3] Google Chrome (x86) topildi, PDF yaratilmoqda...
    "C:\Program Files (x86)\Google\Chrome\Application\chrome.exe" --headless --disable-gpu --no-pdf-header-footer --print-to-pdf="%OUTPUT_PDF%" "%INPUT_HTML%"
    goto :success
)

rem 2. Microsoft Edge orqali PDF qilish
if exist "C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe" (
    echo [2/3] Microsoft Edge topildi, PDF yaratilmoqda...
    "C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe" --headless --disable-gpu --no-pdf-header-footer --print-to-pdf="%OUTPUT_PDF%" "%INPUT_HTML%"
    goto :success
)

if exist "C:\Program Files\Microsoft\Edge\Application\msedge.exe" (
    echo [2/3] Microsoft Edge (x64) topildi, PDF yaratilmoqda...
    "C:\Program Files\Microsoft\Edge\Application\msedge.exe" --headless --disable-gpu --no-pdf-header-footer --print-to-pdf="%OUTPUT_PDF%" "%INPUT_HTML%"
    goto :success
)

rem 3. Agar standart yo'llarda topilmasa, brauzerda index.html ni ochish
echo.
echo Diqqat: Standart brauzer yo'li topilmadi.
echo Sayt avtomatik tarzda brauzeringizda ochiladi.
echo Ochilgach, klaviaturadan Ctrl + P tugmalarini bosing
echo va "Save as PDF" (PDF ga saqlash) ni tanlang.
start "" "%INPUT_HTML%"
goto :end

:success
echo.
echo ========================================================
echo [OK] MUVAFFAQIYATLI YARATILDI!
echo Fayl: tajriba24-taqdimot.pdf
echo ========================================================
echo.
echo Tayyor bo'lgan PDF faylni ochish uchun ixtiyoriy tugmani bosing...
pause >nul
start "" "%OUTPUT_PDF%"
exit /b

:end
pause
