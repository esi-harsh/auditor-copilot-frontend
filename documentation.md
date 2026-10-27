# AMY - Enterprise Auditor Copilot Frontend Documentation

## 1. Project Overview

AMY is an Enterprise Auditor Copilot frontend application designed to assist auditors through an AI-powered interface. It streamlines auditing processes such as digital audits, invoice analysis, purchase order reconciliation, and SOP flowchart generation.

**Business & Technical Goals:**
- Enhance auditor productivity through AI assistance and real-time streaming chat.
- Provide tools for generating and reconciling financial documents.
- Visualize complex data and flows (SOPs, digital audits).
- Multi-provider AI support (Google Gemini, Azure OpenAI, AWS Bedrock).

**Target Users:**
- Enterprise Auditors
- Financial Analysts
- Compliance Officers

---

## 2. Tech Stack

**Frontend Framework & Build Tool:**
- **React:** v19.0.0
- **Vite:** v6.2.6 (Fast Refresh and optimized production bundling)

**Languages & Styling:**
- **JavaScript (ES6+)**
- **Tailwind CSS:** v4.0.12
- **Shadcn UI & Radix UI:** Accessible UI primitives located in `components/ui/`
- **Lucide React:** Icons

**State Management & Navigation:**
- **Redux Toolkit & React-Redux:** Global state management (session state, chat histories, audit data)
- **React Router:** Client-side routing

**Data Visualization & Flowcharts:**
- **React Flow:** Node-based graph and flowchart visualization
- **Recharts:** Charts and financial trends
- **Mermaid:** Diagramming

**File Handling & Processing:**
- **Axios:** HTTP client for REST APIs
- **jsPDF / jspdf-autotable:** Client-side PDF export
- **pdf-lib:** PDF parsing and modification
- **Mammoth:** DOCX to HTML conversion
- **PapaParse:** CSV parsing
- **XLSX:** Excel spreadsheet workbook parsing
- **Tesseract.js:** Client-side OCR

---

## 3. Architecture Overview

The application follows a **feature-based architecture**:
- **Single Page Application (SPA):** Client-side routing with React Router.
- **Component Primitives:** Reusable accessible primitives in `components/ui/`.
- **Global Components:** Header, Navigation, and `ModelConfigsidebar` (AI provider & model selection).
- **Feature Modules (`src/feat/`):** Digital audit interfaces and SOP flowchart visualizers.
- **Streaming SSE Chat:** Real-time token streaming consuming FastAPI backend SSE endpoints.

---

## 4. Folder & File Structure

```
auditor-copilot-frontend/
├── .env                    # Local environment variables (git-ignored)
├── .env.example            # Template for environment configuration
├── .gitignore              # Git ignore rules for node_modules, dist, .env
├── package.json            # Dependencies and npm run scripts
├── package-lock.json       # Deterministic npm dependency lock
├── vite.config.js          # Vite configuration with @ path alias
├── components.json         # Shadcn UI configuration
├── eslint.config.js        # ESLint rules
├── index.html              # HTML entry point
├── documentation.md        # Frontend documentation
├── README.md               # Quickstart guide
├── components/             # Reusable UI primitives
│   └── ui/                 # Button, dialog, select, textarea, card, etc.
└── src/
    ├── assets/             # Images and static resources
    ├── components/         # Feature components (chat interface, audit tables)
    │   └── chatInterfaceComponents/
    │       ├── ConversationWindow.jsx
    │       ├── userInputs.jsx   # Handles SSE streaming & token append
    │       ├── PromptLibrary.jsx
    │       └── StarterSuggestions.jsx
    ├── feat/               # High-level feature modules
    │   ├── digital-audit/
    │   └── sop-flowchart/
    ├── globalComponents/   # App-wide UI
    │   ├── Header.jsx
    │   ├── Sidebar.jsx
    │   └── ModelConfigsidebar.jsx  # Gemini / Azure / Bedrock selector
    ├── hooks/              # Custom React hooks
    ├── lib/                # Utilities (cn helper for Tailwind)
    ├── pages/              # Main view containers (layoutPage.jsx)
    └── redux/              # Redux store and slices
```

---

## 5. Model Configuration & Supported Providers

Users can toggle AI model providers and models in real-time using the **Model Configuration Sidebar** (`ModelConfigsidebar.jsx`):

- **Google Gemini (Default Primary):**
  - `gemini-3.1-flash-lite` (Default recommended: high quota, fast streaming)
  - `gemini-3.5-flash-lite`
  - `gemini-3.8-flash`
  - `gemini-flash-latest`
  - `gemini-2.5-flash` (Automatically mapped by backend to `gemini-3.1-flash-lite`)
- **Azure OpenAI (Secondary):**
  - `GPT-4o`, `GPT-4o-mini`, `gpt-5.2-chat`
- **AWS Bedrock (Secondary):**
  - `Claude 3.7 Sonnet v1`, `Claude 3.5 Sonnet`

User preferences are persisted in browser `localStorage`.

---

## 6. Environment & Setup

1. **Install Node.js:** v18 or higher.
2. **Configure Environment:**
   ```sh
   cp .env.example .env
   ```
   Set the backend URL:
   ```env
   VITE_BACKEND_BASE_URL=http://localhost:8000
   ```
3. **Install Dependencies:**
   ```sh
   npm install
   ```
4. **Start Development Server:**
   ```sh
   npm run dev
   ```
   Opens at `http://localhost:5173` (or port specified by Vite).

5. **Build for Production:**
   ```sh
   npm run build
   ```
   Outputs optimized static bundle to `dist/`.

---

## 7. Real-Time Streaming Architecture

The chat interface (`src/components/chatInterfaceComponents/userInputs.jsx`) consumes backend Server-Sent Events (`/api/chat/stream`):
- Sends the user message and active `llm_config` (provider + model).
- Reads SSE chunks (`data: <token>\n\n`) via `fetch` ReadableStream.
- Progressively appends tokens to the active assistant message without waiting for the entire response to complete.
- Implements resilient error handling and loading-state cleanup.
