# Enterprise Banking Loan Processing System (UI)

A modern, premium, enterprise-grade banking web application for Loan Document Processing using Generative AI. This repository contains the Frontend UI built for Bank Managers, Underwriters, and Loan Officers.

The interface is designed with a strict **60-30-10 Banking Color Theme** to ensure a professional, secure, and trustworthy user experience, and is now **fully responsive across desktop, tablet, and mobile phones**.

## Tech Stack
* **Build Tool:** Vite
* **Framework:** ReactJS (JavaScript)
* **Styling:** Tailwind CSS v3
* **Icons:** Lucide React
* **Routing:** React Router DOM

## Core Features
* **Secure Authentication Flow:** Enterprise login screen.
* **Manager Dashboard:** Key metrics, status tracking, and recent application overviews.
* **Multi-Step Application Form:** Dynamic forms for applicant details, loan types, and document uploads, with a mobile-friendly compact stepper.
* **Interactive Document Upload:** Per-document progress with contextual, staged messaging (uploading → uploaded → reading contents → extracting information → validating → complete).
* **AI Processing Pipeline:** Full-page staged progress indicator for the analysis pipeline (Upload & Pre-processing → Classification → GenAI Extraction → Cross-document Verification → Risk Detection → Summary Generation).
* **Cross-Document Verification:** Discrepancy highlighting and risk assessment panels (responsive table on desktop, stacked cards on mobile).
* **Re-authentication Security:** Manager confirmation modal (mobile bottom-sheet / desktop dialog) for sensitive actions (Approve/Decline).
* **Toast Notifications:** Success/warning/error feedback for key actions.
* **Printable Customer Tokens:** Clean, printer-friendly approval slips.
* **Mobile Navigation:** Left slide-in drawer sidebar with overlay, closes on route change / Escape / outside tap, locks background scroll while open.

---

## 🚀 Setup & Installation Guide for Developers

Ensure you have [Node.js](https://nodejs.org/) (v18+) installed on your machine.

### 1. Extract / Clone the Project
Unzip the provided folder, or if using Git:
```bash
git clone https://github.com/vaibhavdb14/genai-loan-processing-ui.git
cd genai-loan-processing-ui
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Run the Development Server
```bash
npm run dev
```

### 4. Open in Browser
Navigate to the local URL shown in your terminal (usually `http://localhost:5173`).

To test mobile responsiveness, open your browser's DevTools (F12), toggle device toolbar (Ctrl+Shift+M / Cmd+Shift+M), and test at widths like 320px, 375px, 390px, 430px, and 768px.

### 5. Build for Production
```bash
npm run build
```

### 6. Preview the Production Build
```bash
npm run preview
```

---

## Folder Structure

```
genai-loan-processing-ui/
├── public/
│   └── favicon.svg
├── src/
│   ├── assets/
│   ├── components/
│   │   ├── common/
│   │   │   ├── StatusBadge.jsx
│   │   │   ├── ConfirmationModal.jsx
│   │   │   └── EmptyState.jsx
│   │   ├── documents/
│   │   │   └── UploadCard.jsx
│   │   ├── processing/
│   │   │   └── ProcessingStatus.jsx
│   │   ├── Header.jsx
│   │   └── Sidebar.jsx
│   ├── context/
│   │   └── ToastContext.jsx
│   ├── layouts/
│   │   └── MainLayout.jsx
│   ├── pages/
│   │   ├── ApplicationDetail.jsx
│   │   ├── Applications.jsx
│   │   ├── Dashboard.jsx
│   │   ├── Help.jsx
│   │   ├── Login.jsx
│   │   ├── NewApplication.jsx
│   │   ├── Policy.jsx
│   │   └── PrintToken.jsx
│   ├── App.css
│   ├── App.jsx
│   ├── index.css
│   └── main.jsx
├── .gitignore
├── eslint.config.js
├── index.html
├── package.json
├── postcss.config.js
├── tailwind.config.js
└── vite.config.js
```

> Note: the default Vite template assets (`hero.png`, `react.svg`, `vite.svg`) from the original scaffold are not included, as they are not referenced anywhere in the application code.

---

## Responsive Design

The application is fully responsive and has been designed/tested for:
* **Mobile phones:** 320px–480px (portrait & landscape)
* **Tablets:** 768px–1024px
* **Laptop / Desktop:** 1024px and above

Key responsive behaviors:
* Sidebar collapses into a left slide-in drawer (hamburger menu) on screens below the `lg` breakpoint.
* All data tables (Dashboard, Applications, Policy, Cross-Document Verification) convert into stacked, touch-friendly cards on mobile instead of horizontally scrolling.
* Forms switch from two-column to single-column layouts on mobile with larger touch targets (44px+ minimum height).
* Modals become near-full-width, bottom-anchored sheets on mobile and centered dialogs on desktop.
* Tabs (Applications page) scroll horizontally on narrow screens instead of wrapping.

## Frontend Process States (Simulated)

Since this is a **frontend-only** build with no live backend/AI service wired up, document upload and analysis progress are simulated client-side purely to demonstrate the intended UX. No real backend processing is claimed — only the interaction pattern is shown:

* **Per-document upload** (`src/components/documents/UploadCard.jsx`): staged progress with contextual messages — "Uploading your document..." → "Document uploaded" → "Reading document contents..." → "Extracting important information..." → "Checking extracted information..." → "Document analysis completed".
* **Application-level pipeline** (`src/components/processing/ProcessingStatus.jsx`, used in `src/pages/NewApplication.jsx`): full-page staged progress across Document Upload & Pre-processing → Document Classification → GenAI Data Extraction → Cross-document Verification → Risk & Exception Detection → AI Summary Generation.

This frontend is structured to be ready for real backend/API integration later — swap the `setTimeout`/`setInterval` simulations in `UploadCard.jsx` and `NewApplication.jsx` for real API calls and progress events when the backend is available.

## Digital Profile Feature

A new **Digital Profile** screen (`/digital-profile`) shows the applicant's verified data after document verification completes, and hands off into an **Eligibility Check** stage (`/eligibility`, currently a placeholder — the eligibility engine itself is a separate feature).

**Data flow:**
```
digitalProfileService.fetchDigitalProfile()
        ↓
   raw API response (or mockDigitalProfile fallback if no API is configured)
        ↓
   normalizeDigitalProfile()
        ↓
   normalized profile object
        ↓
   DigitalProfile.jsx renders section components
```

- `src/services/digitalProfileService.js` — fetches from `${VITE_API_BASE_URL}/api/digital-profile/:id`. If `VITE_API_BASE_URL` isn't set (e.g. local frontend-only development), it transparently falls back to `src/services/mockDigitalProfile.js`, a clearly isolated fixture matching the real API shape — never mixed into production logic.
- `src/services/normalizeDigitalProfile.js` — the only place that reads raw API field names; all UI components consume the normalized shape only, so a backend response change only requires editing this one file.
- `src/utils/formatters.js` — shared `formatCurrency`, `maskValue`, `calculateSuccessRate`, `displayOrFallback` helpers, used consistently instead of ad-hoc formatting per field.
- `src/components/profile/*` — reusable, presentational components: `ProfileHeader`, `VerificationBanner`, `ProfileStats` (Overall Score / Verification Status / Risk Level / Documents Passed), `InfoCard` (generic key-value section used for Applicant/Employment/Income/Banking/Tax/Loan), `AIVerificationSummary` (renders passed checks *and* discrepancies exactly as the API reports them), `RiskAssessment`, `DocumentProcessingSummary`, `EligibilityCTA`, plus `ProfileSkeleton` (loading state) and `ProfileErrorState` (error + retry).

**No screenshot data is hard-coded** — every value rendered comes from the normalized profile object. Sections and individual fields are simply omitted (or shown as "Not available") when the API doesn't return them, rather than the page breaking or showing `undefined`.

To connect a real backend, set `VITE_API_BASE_URL` in a `.env` file at the project root:
```
VITE_API_BASE_URL=https://your-api-host.com
```

## What Was Changed in This Update
* Added mobile slide-in drawer navigation (`Sidebar.jsx`) and a responsive `Header.jsx` with hamburger trigger and collapsible mobile search.
* Added new reusable components: `StatusBadge`, `ConfirmationModal`, `EmptyState`, `ProcessingStatus`, `UploadCard`, and a `ToastContext` notification system.
* Converted tables to mobile card layouts in `Dashboard.jsx`, `Applications.jsx`, `Policy.jsx`, and the verification table in `ApplicationDetail.jsx`.
* Rebuilt `NewApplication.jsx`'s document step with real interactive per-document upload/processing states, and added a compact mobile stepper.
* Increased touch target sizes and improved accessibility (icon+text+color status indicators, `aria-label`s, keyboard-dismissible modals) across the app.
* All existing functionality (login, navigation, dashboard, new application, document upload, applications list, application detail, approve/decline, help, print token) is preserved.

No backend, API contracts, or authentication logic were modified — this is a frontend-only enhancement.
