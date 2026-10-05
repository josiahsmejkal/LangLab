@echo off
cd /d "%~dp0"
echo LangLab will open at http://localhost:8080
echo Keep this window open while using the website.
echo.
py -3 --version >nul 2>nul
if not errorlevel 1 (
  py -3 -m http.server 8080 --bind 127.0.0.1 --directory dist
  goto done
)
python --version >nul 2>nul
if not errorlevel 1 (
  python -m http.server 8080 --bind 127.0.0.1 --directory dist
  goto done
)
echo Python 3 was not found. Install Python 3, then run this file again.
:done
pause
