# Sravanth Kumar Reddy: Portfolio

Static portfolio site (HTML, CSS, JavaScript). No build step.

## Structure
```
portfolio/
├── index.html
├── assets/
│   ├── css/style.css
│   ├── js/main.js
│   ├── img/favicon.svg
│   ├── img/profile.jpg / profile.webp / profile-sm.jpg
│   └── Sravanth_Kumar_Reddy_Resume.pdf
├── .github/workflows/pages.yml   # auto-deploy to GitHub Pages
├── .gitignore
└── README.md
```

## Run locally
Open `index.html` in a browser, or run `python -m http.server 8000` and visit http://localhost:8000.

## Push to GitHub
```bash
cd portfolio
git init
git add .
git commit -m "Add portfolio"
git branch -M main
git remote add origin https://github.com/sravanth-dot/portfolio.git
git push -u origin main
```
Create the empty repo `portfolio` on GitHub first.

## Publish
On GitHub: **Settings > Pages > Source: GitHub Actions**. The workflow deploys on every push to `main`.
Your site will be at `https://sravanth-dot.github.io/portfolio/`.
