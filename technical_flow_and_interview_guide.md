# Interview-AI - Technical Architecture Flow & Interview Guide

This document contains a comprehensive breakdown of the technical flow, tech stack interactions, and preparation questions for interviewing about the **Interview-AI** platform.

---

## 💡 Simple Project Analogy & Flow

Think of the **Interview-AI** application like a **smart restaurant**:

1. **React Frontend (The Waiter)** — *[React v19, Vite, TailwindCSS v4, Axios, React Router v7]*:
   - Takes your "order" (your resume, details, and job link).
   - Serves the finished mock questions and PDF resume back to you at your table.

2. **Express Backend (The Kitchen)** — *[Node.js, Express v5, JWT, bcryptjs, Helmet, express-rate-limit]*:
   - Receives the order, coordinates the work, and ensures everything runs safely and securely (handling authentication, cookies, and rate-limiting).

3. **MongoDB Database (The Pantry)** — *[MongoDB Atlas, Mongoose v9]*:
   - Securely stores ingredients and recipes (user accounts, mock reports, and roadmaps) so they don't get lost.

4. **Gemini AI (The Head Chef)** — *[@google/genai, Zod, zod-to-json-schema]*:
   - Uses its intelligence to analyze resumes and design customized interview questions, roadmaps, and scores.

5. **Puppeteer (The Assistant Chef)** — *[puppeteer v24.37, pdf-parse, multer]*:
   - Goes out to the web to scrape/fetch job details, and prints the final, custom-designed resumes as A4 PDFs.

### 📊 Simple Architecture Diagram (With Tech Stack)

```
   ┌────────────────────────────────────────────────────────┐
   │                  1. React Frontend                     │
   │       (React v19, Vite, Tailwind v4, Axios, Router)    │
   └──────────────────────────┬─────────────────────────────┘
                              │
                    Axios API Call (JSON)
                              │
                              v
   ┌────────────────────────────────────────────────────────┐
   │                  2. Express Backend                    │
   │       (Node.js, Express v5, JWT, bcryptjs, Helmet)     │
   └──────┬───────────────────┬──────────────────────┬──────┘
          │                   │                      │
          │                   │                      │
     Mongoose DB         @google/genai            Puppeteer
        Save             Gemini JSON            Scraping/PDF
          │                   │                      │
          v                   v                      v
┌──────────────────┐┌──────────────────┐┌──────────────────┐
│ 3. MongoDB Atlas ││ 4. Gemini 2.5 AI ││  5. Puppeteer    │
│    (Database)    ││  (Zod Schema)    ││(pdf-parse,Multer)│
└──────────────────┘└──────────────────┘└──────────────────┘
```

---

## 🛠️ Tech Stack & Key Libraries

### Frontend
* **React (v19)**: Component-based UI framework.
* **Vite**: Ultra-fast bundler and hot-reloading dev server.
* **TailwindCSS (v4)**: Modern utility-first CSS framework for styles.
* **Axios (v1.13)**: HTTP client for API requests (configured with `withCredentials: true` to handle cookies).
* **React Router (v7)**: Handles client-side URL routing.

### Backend & Core APIs
* **Node.js & Express (v5)**: JavaScript runtime and minimalist web API framework.
* **Mongoose (v9) & MongoDB Atlas**: ODM and cloud NoSQL database.
* **`@google/genai` (v1.42)**: Google Gemini AI SDK (`gemini-2.5-flash` model).
* **`puppeteer` (v24.37)**: Headless browser automation for PDF rendering and scraping.
* **`pdf-parse` (v2.4)**: Text extraction from PDF uploads.
* **`multer` (v2.0)**: Middleware handling file upload streams (`multipart/form-data`).
* **`zod` (v3.25)** & **`zod-to-json-schema`**: Backend input validation schemas and structured AI output configuration.

### Security
* **`helmet` (v8.2)**: Secures HTTP response headers.
* **`express-rate-limit` (v8.5)**: Rate limiter protecting authentication endpoints.
* **`jsonwebtoken` (v9.0)**: User session signing.
* **`bcryptjs` (v3.0)**: Safe password hashing.

---

## 🔄 Technical Flows (Mapped to Tech Stack)

### 1. User Registration & Session Flow
1. **Submit**: User submits details in `Register.jsx` (React). **Axios** sends a POST to `/api/auth/register`.
2. **Rate Limit**: Request enters the router through **express-rate-limit** to prevent automated brute-force attempts.
3. **Validate**: Request body is validated against a **Zod** schema (`registerSchema`). It enforces strict username constraints (no spaces or symbols), email correctness, and password minimum length (6+ characters).
4. **Hash**: The password string is securely hashed using **bcryptjs** (10 salt rounds).
5. **Save**: **Mongoose** creates a new document in the **MongoDB Atlas** `users` collection.
6. **Token**: A JSON Web Token containing the user's database ID and username is signed using **jsonwebtoken**.
7. **Cookie**: The token is returned in the response headers using **cookie-parser** as a secure, `httpOnly`, `sameSite: "none"` cookie to protect against XSS (Cross-Site Scripting).

---

### 2. Mock Interview & Prep Roadmap Generation Flow
1. **Upload**: User uploads a resume file (`.pdf`) and submits job details. **Axios** uploads it as `multipart/form-data`.
2. **Handle File**: The backend catches the binary file stream in-memory using **Multer**.
3. **Parse PDF**: **pdf-parse** extracts the raw text contents of the resume buffer into a JavaScript string.
4. **Scrape Job Description (Optional)**: If a job board URL is provided:
   - The backend requests the running Chromium instance from the custom **Puppeteer** singleton (`getBrowser()`).
   - Opens a tab page (`browser.newPage()`), mocks browser fingerprint headers to prevent Cloudflare/WAF blocks, navigates to the page, and grabs the raw inner text.
5. **Prompt Engine**: Creates a customized prompt combining the extracted resume text, job description text, and self-description.
6. **Gemini AI Call**: Calls the **`@google/genai`** SDK for the `gemini-2.5-flash` model. We translate our **Zod** schema (`interviewReportSchema`) into a JSON schema using **`zod-to-json-schema`** and pass it as the `responseSchema` constraint to enforce perfect JSON formatting.
7. **Save & Return**: The generated structured JSON report is stored in MongoDB using **Mongoose** (`interviewReport.model.js`) and returned to the React frontend.

---

### 3. Resume Tailoring & PDF Download Flow
1. **Request**: The user triggers tailored resume generation for a specific report ID.
2. **Draft HTML**: Backend asks Gemini AI to write a professional resume tailored to the target job description formatted entirely in standard **HTML + inline CSS**.
3. **Render PDF**:
   - Backend retrieves the running **Puppeteer** browser instance.
   - Opens a new tab, injects the HTML code using `page.setContent()`.
   - Compiles it to a PDF buffer using `page.pdf()` specifying page standards (`A4` format, `20mm` top/bottom margins, `15mm` left/right margins).
   - Tab is closed (`page.close()`) to avoid RAM bloat.
4. **Download**: The PDF buffer is sent to the client. The frontend converts the response into a browser **Blob** to prompt a local file download.

---

## 💬 Core Developer Interview Q&A

### Q1: Puppeteer is very memory-heavy. How did you optimize it so the server doesn't crash on hosting services like Render?
> **Answer:**
> *"Instead of launching a brand new Chromium browser instance every time a user wants to scrape a job description or print a resume (which takes ~100MB+ of RAM and high CPU startup time), I implemented a **Singleton pattern** for Puppeteer (`getBrowser()`).*
> 
> *We keep a single browser instance running in the background. When a request comes in, we open a lightweight browser tab (`browser.newPage()`), perform the task, and then ensure it is closed (`page.close()`) inside a `finally` block to prevent memory leaks. This keeps memory usage extremely low and allows it to run stably on a 512MB RAM free-tier server."*

### Q2: How did you scrape job descriptions without getting blocked by anti-bot systems?
> **Answer:**
> *"Many job boards block scrapers using automated bot detection. To bypass this, I configured Puppeteer with several stealth modifications:*
> 1. *We set a realistic Chrome User-Agent header.*
> 2. *We injected extra headers like `Accept-Language` to look like a standard user browser.*
> 3. *We used `page.evaluateOnNewDocument` to remove/override the `navigator.webdriver` flag, which is the primary way websites detect automated browsers like Puppeteer.*
> 4. *We set realistic viewport dimensions and structured the prompt so that Gemini filters out Cloudflare/error boilerplates in case of a block."*

### Q3: Large Language Models (LLMs) are notorious for returning unstructured text. How did you guarantee that Gemini always returns clean, parsable JSON?
> **Answer:**
> *"I used the official `@google/genai` library and configured **Structured JSON outputs**. We define the exact structure we need using **Zod schemas** (e.g., matching the fields we need for roadmap, projects, and questions).*
> 
> *We convert the Zod schemas into JSON Schema format using `zod-to-json-schema` and pass it to Gemini in the API call's config: `responseMimeType: "application/json"` and `responseSchema`. This forces the Gemini engine to output data that matches our exact structural types, preventing runtime JSON parsing errors."*

### Q4: How did you implement secure authentication and session management?
> **Answer:**
> *"For authentication, we used **JSON Web Tokens (JWT)**. The token is generated upon login/registration and stored in a secure, **HttpOnly, SameSite=None** cookie. Storing it in HttpOnly cookies prevents Cross-Site Scripting (XSS) attacks from accessing the token via JavaScript.*
> 
> *For logout, we created a **Blacklist collection in MongoDB**. When a user logs out, we add their token to the blacklist. I configured a **MongoDB TTL (Time-To-Live) index** on the blacklist collection so that expired tokens automatically delete themselves after 24 hours, keeping our database database size optimized without needing cron jobs."*

### Q5: How did you secure the server against attacks?
> **Answer:**
> *"- We wired up **Helmet** middleware to secure our HTTP headers (like preventing clickjacking and enforcing SSL).*
> *- We used **express-rate-limit** on authentication endpoints (`/login` and `/register`) to limit clients to 100 requests per 15 minutes, preventing brute-force attacks.*
> *- We implemented strict schema validation using **Zod** at the route level to sanitize and validate incoming request bodies before they reach the controller database queries."*
