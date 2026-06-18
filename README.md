# Interview-AI - GenAi Resume & Interview Preparation Platform

InterviewAI is a state-of-the-art mock interview and prep roadmap generator powered by Google Gemini AI. It analyzes a candidate's resume/self-description alongside a target job description to build a custom study strategy and evaluation scorecard.

---

## Key Features

* **Tailored Interview Strategy**: Instantly computes match score and job readiness projections.
* **Interactive Mock Practice**: Generates exactly **16 dynamic questions** (10 technical, 6 behavioral) tailored to the role.
* **Smart Evaluator**: Grades candidate answers for technical accuracy, communication, and problem-solving, outputting scores and professional suggested answers.
* **Study Roadmap**: Computes custom week-by-week learning goals, mini-projects, and guides.
* **Resume Tailoring**: Generates ATS-friendly, professional PDF resumes.

---

## Production Optimizations Included

1. **Security Hardening**:
   - Wired up **Helmet** for secure HTTP response headers.
   - Built brute-force protection using **express-rate-limit** on auth endpoints.
   - Implemented strict backend input schema validation using **Zod**.

2. **Performance & Scalability**:
   - **Shared Puppeteer Instance**: Reuses a single Chromium browser process for PDF printing and job scraping. Memory allocation is drastically reduced, avoiding server crashes.
   - **Database TTL (Time to Live) Indexes**: Configured to auto-purge blacklisted JWT tokens after 24 hours.

3. **Robustness**:
   - Centralized `errorHandler` middleware.
   - Wrapped controllers in async catching wrappers (`catchAsync`) to prevent uncaught process termination.

4. **UX Improvements**:
   - Rotating status messages and a custom multi-phase loading bar during report generation.

---

## Tech Stack

* **Frontend**: React (v19), Vite, TailwindCSS
* **Backend**: Node.js, Express, MongoDB & Mongoose
* **AI Engine**: Google Gemini AI (`gemini-2.5-flash`)
* **Utilities**: Puppeteer (PDF/Scraper), Zod (Validation), JWT (Auth)

---

## Setup Instructions

### Prerequisites
* Node.js (v18+)
* MongoDB instance (local or Atlas)
* Google Gemini API Key

---

### Backend Setup

1. Navigate to the backend folder:
   ```bash
   cd Backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file in the `Backend` directory:
   ```env
   PORT=3000
   MONGO_URI=your_mongodb_connection_uri
   JWT_SECRET=your_jwt_signing_secret
   GOOGLE_GENAI_API_KEY=your_gemini_api_key
   FRONTEND_URL=http://localhost:5173
   ```
4. Start the backend dev server:
   ```bash
   npm run dev
   ```

---

### Frontend Setup

1. Navigate to the frontend folder:
   ```bash
   cd Frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file (optional for local dev as it defaults to port 3000):
   ```env
   VITE_API_URL=http://localhost:3000
   ```
4. Start the frontend dev server:
   ```bash
   npm run dev
   ```
5. Open your browser and navigate to `http://localhost:5173`.
