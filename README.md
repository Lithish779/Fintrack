📊 FinTrack

FinTrack is a scalable personal finance tracking web app built with React + Vite, leveraging Firebase Authentication for secure user sign-in. Designed for performance, security, and extensibility.

🚀 Project Overview

FinTrack delivers a seamless, secure login experience using email/password and Google sign-in, backed by Firebase. It’s optimized for rapid iteration and extensibility, leveraging modern front-end architecture.

Key priorities:

💡 Lightweight & Fast: powered by Vite for ultra-fast development builds

🔐 Secure Auth: Firebase handles authentication and session management

🧠 Clear Architecture: modular React components with reusable logic

📦 Future-Ready: easy to add features like real-time budgeting, expense tracking, or analytics dashboards

🧱 Tech Stack
Layer	Technology
UI	React
Build Tool	Vite
Auth & Backend	Firebase Auth
Styling	Your choice (CSS / Tailwind / etc)
Deployment	Vercel
🏁 Features

🔑 Firebase Email/Password Auth

👤 Google OAuth Sign-In

📍 Routing via React Router

⚡ Fast reloads with Vite

🛠 Easy configuration for multiple environments

🛠 Setup & Installation
1. Clone
git clone https://github.com/<your-org>/fintrack.git
cd fintrack
2. Install dependencies
npm install
3. Firebase Config

Create a file at the root:

.env.local

Add:

VITE_FIREBASE_API_KEY=<your_api_key>
VITE_FIREBASE_AUTH_DOMAIN=<your_auth_domain>
VITE_FIREBASE_PROJECT_ID=<your_project_id>
VITE_FIREBASE_STORAGE_BUCKET=<your_bucket>
VITE_FIREBASE_MESSAGING_SENDER_ID=<your_sender_id>
VITE_FIREBASE_APP_ID=<your_app_id>

Important: Never commit sensitive keys — they belong in env vars.

4. Run Locally
npm run dev

Open http://localhost:5173 in your browser.

📦 Structure (High Level)
src/
├─ assets/
├─ components/       # UI & form components
├─ contexts/         # Auth context
├─ firebase/         # Firebase init + helpers
├─ pages/            # Route-level screens
├─ routes/           # Router definitions
├─ styles/           # Global & utility styles
├─ App.jsx
└─ main.jsx
🔐 Firebase Authentication

We’re using Firebase Auth with:

Email/Password

Google OAuth

Session persistence is handled by Firebase automatically. Tokens are managed client-side and can be used for future API protection.

📈 Deployment

Connect repo to Vercel

Add same environment variables in Vercel dashboard

Deploy — zero config needed

🧪 Testing

If you add tests in the future:

npm test

Recommend:

Jest for logic

React Testing Library for UI

📌 Next Steps (Roadmap)

Expense tracking dashboard

Analytics & charts (e.g., D3 / Recharts)

Push notifications

Backend API for advanced rules
