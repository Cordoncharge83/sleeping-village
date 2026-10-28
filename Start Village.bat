@echo off
cd /d "%~dp0"
if not exist node_modules\vite\bin\vite.js (
 echo Project libraries are missing. Run npm install in this folder first.
 pause
 exit /b 1
)
echo Open http://127.0.0.1:5173/village/ in your browser.
echo Close this window or press Ctrl+C to stop the preview.
call npm.cmd run dev
pause
