@echo off
echo 🚀 PressureVerse Vercel Deployment
echo Installing project dependencies...
call npm install

if %errorlevel% neq 0 (
  echo npm install failed
  pause
  exit /b %errorlevel%
)

echo Building production files...
call npm run build

if %errorlevel% neq 0 (
  echo Build failed
  pause
  exit /b %errorlevel%
)

echo Deploying to Vercel production...
call npx vercel --prod

pause
