# InterviewAI — Frontend (React + Vite)

This directory contains the user interface components and hooks for the **InterviewAI** application, built on React (v19) and bundled using Vite.

---

## Technical Stack & Libraries

* **Core**: React 19 (Hooks, Context Provider)
* **Routing**: React Router (v7)
* **Build System**: Vite (with Fast Refresh and HMR support)
* **Styling**: SCSS & TailwindCSS
* **HTTP Client**: Axios (configured with CORS credentials support)

---

## Directory Structure

* `/src/features/auth` - Contains registration, login forms, auth contexts, state hooks (`useAuth`), and protected routing wrappers.
* `/src/features/interview` - Core features, including strategy generation, roadmaps, recommended projects, and the interactive mock interview practice panel.
* `/src/style.scss` & `index.css` - Global theme variables, animations, and premium glassmorphism styling presets.

---

## Local Development Setup

1. Make sure you have installed the root backend or have it running.
2. Navigate to this directory:
   ```bash
   cd Frontend
   ```
3. Install dependencies:
   ```bash
   npm install
   ```
4. Define your API server address (optional if running local default backend on port 3000):
   Create a `.env` file inside this `Frontend` directory:
   ```env
   VITE_API_URL=http://localhost:3000
   ```
5. Run the Vite development server:
   ```bash
   npm run dev
   ```

---

## Production Build & Deployment

To bundle your assets for production:
1. Ensure `VITE_API_URL` points to your production backend server.
2. Compile resources:
   ```bash
   npm run build
   ```
3. This creates a highly optimized static bundle inside the `/dist` directory, ready to be served by any static hosting platform (Vercel, Netlify, Cloudflare Pages, S3).
