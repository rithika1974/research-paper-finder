# 🔬 Research Paper Finder

AI-powered academic paper discovery tool. Describe your research and instantly get relevant papers with summaries, relevance analysis, and citation placement suggestions — powered by **Gemini 2.0 Flash** (free).

![Research Paper Finder](https://img.shields.io/badge/Powered%20by-Gemini%202.0%20Flash-blue?style=flat-square)
![Next.js](https://img.shields.io/badge/Built%20with-Next.js%2014-black?style=flat-square)
![License](https://img.shields.io/badge/License-MIT-green?style=flat-square)

---

## ✨ Features

- 🔍 **Smart paper discovery** — finds papers from Google Scholar, arXiv, PubMed, and more
- 🧠 **AI summaries** — plain-English summary of what each paper found
- 💡 **Relevance analysis** — explains specifically how each paper helps *your* research
- 📌 **Citation placement** — suggests which sections of your paper to cite it in
- 📋 **Copy citation** — one-click copy for each paper
- 📥 **Export** — download as `.bib` (BibTeX) or `.json`
- ♿ **Accessible** — keyboard navigable, screen reader friendly, ARIA labels throughout
- 🌙 **Fast** — skeleton loading, Ctrl+Enter shortcut, example prompts

---

## 🚀 Quick Start (Local)

### 1. Clone the repo

```bash
git clone https://github.com/YOUR_USERNAME/research-paper-finder.git
cd research-paper-finder
```

### 2. Install dependencies

```bash
npm install
```

### 3. Get your free Gemini API key

1. Go to [https://aistudio.google.com/app/apikey](https://aistudio.google.com/app/apikey)
2. Sign in with your Google account
3. Click **Create API Key**
4. Copy the key

### 4. Set up environment

```bash
cp .env.local.example .env.local
```

Open `.env.local` and paste your key:

```
GEMINI_API_KEY=your_key_here
```

### 5. Run the app

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) 🎉

---

## 🌐 Deploy to Vercel (Free)

This is the recommended way to make it available on the web.

### Step 1 — Push to GitHub

```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/research-paper-finder.git
git push -u origin main
```

### Step 2 — Deploy on Vercel

1. Go to [vercel.com](https://vercel.com) and sign in with GitHub
2. Click **"Add New Project"**
3. Import your `research-paper-finder` repository
4. In the **Environment Variables** section, add:
   - Key: `GEMINI_API_KEY`
   - Value: your Gemini API key
5. Click **Deploy**

Your app will be live at `https://your-project.vercel.app` in ~2 minutes. ✅

Every time you push to `main`, Vercel auto-deploys.

---

## 🆓 Other Free Hosting Options

| Platform | Notes |
|---|---|
| **Vercel** ⭐ | Best for Next.js. Auto-deploy from GitHub. |
| **Netlify** | Also great. Add env vars in dashboard. |
| **Railway** | Good for full-stack. Free tier available. |
| **Render** | Free tier with some limitations. |

---

## 🔑 Getting Your Gemini API Key (Free)

1. Visit [https://aistudio.google.com/app/apikey](https://aistudio.google.com/app/apikey)
2. Sign in with Google
3. Click **Create API Key**
4. Select or create a Google Cloud project
5. Copy the key — it looks like `AIzaSy...`

The free tier includes **1,500 requests/day** and **1 million tokens/minute** — more than enough for personal use.

---

## ⚠️ Important Notes

- **Verify papers before citing** — AI can occasionally hallucinate paper titles or URLs. Always check that a paper exists before adding it to your bibliography.
- **API key security** — your key is stored server-side and never exposed to the browser. Never commit `.env.local` to GitHub (it's in `.gitignore`).

---

## 🛠 Tech Stack

- **[Next.js 14](https://nextjs.org/)** — React framework with App Router
- **[Gemini 2.0 Flash](https://deepmind.google/technologies/gemini/)** — AI model (free tier)
- **[Tailwind CSS](https://tailwindcss.com/)** — styling
- **TypeScript** — type safety

---

## 📄 License

MIT — free to use, modify, and deploy.
