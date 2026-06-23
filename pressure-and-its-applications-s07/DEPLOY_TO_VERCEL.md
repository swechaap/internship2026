# Deploy PressureVerse to Vercel

## Option 1: Fast Manual Deploy

```bash
npm install
npm run build
npx vercel --prod
```

When Vercel asks questions, use:

```txt
Set up and deploy? yes
Which scope? your account
Link to existing project? no
Project name? pressureverse
Directory? ./
Override settings? no
```

## Option 2: Deploy Using Included Scripts

### Windows

```bash
deploy-vercel.bat
```

### macOS / Linux

```bash
chmod +x deploy-vercel.sh
./deploy-vercel.sh
```

## Option 3: Auto Deploy with GitHub Actions

This project includes:

```txt
.github/workflows/vercel-deploy.yml
```

### Step 1: Push to GitHub

```bash
git init
git add .
git commit -m "Initial PressureVerse vibe coding project"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/pressureverse.git
git push -u origin main
```

### Step 2: Import project in Vercel

1. Open Vercel dashboard
2. Add New Project
3. Import the GitHub repository
4. Framework Preset: Vite
5. Build Command: `npm run build`
6. Output Directory: `dist`
7. Deploy

### Step 3: Add GitHub repository secrets

In GitHub:

```txt
Repository → Settings → Secrets and variables → Actions → New repository secret
```

Add:

```txt
VERCEL_TOKEN
VERCEL_ORG_ID
VERCEL_PROJECT_ID
```

### Step 4: Push changes

Every push to `main` triggers an automatic Vercel production deployment.

## Vercel Configuration Included

```json
{
  "framework": "vite",
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "installCommand": "npm install"
}
```
