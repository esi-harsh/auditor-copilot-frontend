# Auditor Copilot Frontend

AI-powered enterprise auditing assistant frontend built with **React 19**, **Vite**, and **Tailwind CSS**. Connects with the FastAPI backend to provide real-time streaming audits, compliance assessments, SOP flowchart visualizations, and document reconciliation.

---

## Features

- **Multi-Model AI Chat:** Instant real-time token streaming powered by Google Gemini, Azure OpenAI, and AWS Bedrock.
- **Model Configuration Sidebar:** Effortlessly switch between providers and models (`gemini-3.1-flash-lite`, `gemini-3.8-flash`, etc.) on the fly.
- **Digital Audit Dashboard:** Reconcile POs, invoices, and review automated audit metrics with interactive charts.
- **SOP Flowcharts:** Render interactive flowchart nodes and diagrams dynamically from SOP text procedures using React Flow and Mermaid.
- **Modern UI:** Built on accessible Tailwind CSS and Radix UI primitives.

---

## Quickstart

### Prerequisites
- Node.js 18+
- npm (or yarn / pnpm)

### 1. Installation
```bash
# Clone the repository and navigate to frontend
cd auditor-copilot-frontend

# Install dependencies
npm install
```

### 2. Environment Configuration
Copy the template environment file:
```bash
cp .env.example .env
```
Ensure `VITE_BACKEND_BASE_URL` points to your backend instance:
```env
VITE_BACKEND_BASE_URL=http://localhost:8000
```

### 3. Run Development Server
```bash
npm run dev
```

### 4. Build for Production
```bash
npm run build
```

---

## Available Scripts

| Command | Description |
|---|---|
| `npm run dev` | Starts Vite dev server with hot module replacement |
| `npm run build` | Bundles production assets into `dist/` |
| `npm run preview` | Locally previews the production build |
| `npm run lint` | Runs ESLint code quality checks |

---

## Documentation
For complete technical details, component architecture, and state management guides, see [documentation.md](./documentation.md).
