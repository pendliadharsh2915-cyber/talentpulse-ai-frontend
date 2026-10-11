# TalentPulse AI — Frontend Web Application

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/pendliadharsh2915-cyber/talentpulse-ai-frontend)

The interactive client application for **TalentPulse AI**, an AI-assisted recruitment platform and Resume Intelligence System. Built with **React 18**, **Vite 5**, **React Router 6**, and modern CSS.

---

## 🌟 Key Features

* **Job Discovery & Search**: Filter jobs by employment type (Full-time, Contract, Internship, Part-time), search by title/skills, and browse paginated results.
* **1-Click Application Workflow**: Fast application submission with duplicate application prevention.
* **Resume Intelligence Engine**:
  * PDF resume upload with client validation (<5MB).
  * Real-time skill match percentage scoring comparing verified candidate skills against job requirements.
  * AI-generated **Executive Resume Summary** with 1-click clipboard copy.
  * AI-generated **Tailored Cover Letter** customized for specific requisitions with 1-click clipboard copy.
  * Practical learning roadmaps and suggestions for missing skills.
* **Interactive Notification Center**: Dropdown bell in navigation with live unread badge, relative timestamps, and mark-as-read actions.
* **Saved / Bookmarked Jobs**: 1-click job bookmarking and dedicated saved requisitions management page.
* **Recruiter Command Center**:
  * Create, edit, and deactivate job listings.
  * Candidate pipeline review with status progression (`APPLIED` ➔ `REVIEWING` ➔ `SHORTLISTED` ➔ `REJECTED`).
  * In-browser candidate extracted resume viewer modal.
  * Secure original candidate resume PDF download button.

---

## 🛠️ Technology Stack

| Layer | Technologies |
|---|---|
| **Framework** | React 18.3 |
| **Build Tool & Dev Server** | Vite 5.4 |
| **Routing** | React Router DOM 6.26 |
| **HTTP Client** | Axios 1.7 (with JWT interceptors) |
| **Icons** | Lucide React |
| **Styling** | Vanilla CSS Design System with Glassmorphism |

---

## 🚀 Quick Start (Local Development)

### Prerequisites
* **Node.js**: v18.0 or higher (`node -v`)
* **npm**: v9.0 or higher (`npm -v`)
* **Running Backend**: The Spring Boot backend running on `http://localhost:8080`

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Environment (Optional)
By default, the Vite dev server uses a proxy configured in `vite.config.js` pointing `/api` requests to `http://localhost:8080`.

If you are pointing to a custom backend URL:
```bash
cp .env.example .env
```
And adjust `VITE_API_BASE_URL` in `.env`:
```env
VITE_API_BASE_URL=http://localhost:8080/api
```

### 3. Run Development Server
```bash
npm run dev
```
Open your browser at: **`http://localhost:5173`**

### 4. Build for Production
```bash
npm run build
```
The production bundle will be generated in the `dist/` directory.

To preview the production build locally:
```bash
npm run preview
```

---

## 🔑 Pre-Configured Demo Accounts

For instant testing with pre-seeded data:

| Role | Email | Password |
|---|---|---|
| **Job Seeker** | `seeker@demo.com` | `password123` |
| **Recruiter** | `recruiter@demo.com` | `password123` |

You can also create a new candidate or recruiter account via the **Register** page.

---

## 🐳 Docker Deployment

A production `Dockerfile` and `nginx.conf` are included:
```bash
docker build -t talentpulse-frontend .
docker run -p 80:80 talentpulse-frontend
```

---

## 📄 License
MIT License.
