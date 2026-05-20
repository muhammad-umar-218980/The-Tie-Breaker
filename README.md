# The Tie Breaker

An AI-powered decision assistant that helps you evaluate choices using structured analysis formats powered by Gemini.

## What it does

You enter a decision prompt (for example: _“Should I move to New York or San Francisco?”_), choose an analysis format, and the app returns structured output for each option.

Supported formats:
- **Pros & Cons**
- **Comparison Table**
- **SWOT Analysis**

It also includes a **“Roll the Dice”** tie-breaker that randomly selects one of the discovered options.

## Tech stack

- **Frontend:** React 19 + TypeScript + Vite + Tailwind CSS
- **Backend:** Express + TypeScript
- **AI:** Google Gemini (`@google/genai`)
- **Animations/Icons:** `motion`, `lucide-react`

## Project structure

```text
.
├── server.ts                     # Express server + /api/analyze endpoint + Vite middleware/static serving
├── src/
│   ├── App.tsx                   # Main UI, request flow, format selection, random tie-breaker
│   ├── types.ts                  # Shared response/data types
│   └── components/
│       ├── ProsConsView.tsx      # Pros & cons renderer
│       ├── ComparisonView.tsx    # Comparison matrix renderer
│       └── SWOTView.tsx          # SWOT renderer
├── .env.example                  # Environment variable template
└── package.json                  # Scripts and dependencies
```

## Environment variables

Create a `.env` file (or use your platform secrets) with:

```env
GEMINI_API_KEY=your_api_key_here
APP_URL=http://localhost:3000
```

Only `GEMINI_API_KEY` is required for analysis calls.

## Local development

### 1) Install dependencies

```bash
npm ci
```

### 2) Run in development mode

```bash
npm run dev
```

The app runs on **http://localhost:3000**.

In development, the Express server hosts the API and uses Vite middleware for the React app.

## Production build and run

```bash
npm run build
npm start
```

- `npm run build` creates:
  - frontend assets in `dist/`
  - bundled server in `dist/server.cjs`
- `npm start` runs the production server from `dist/server.cjs`

## Available scripts

- `npm run dev` – start development server (`tsx server.ts`)
- `npm run lint` – TypeScript type-check (`tsc --noEmit`)
- `npm run build` – build frontend and bundle backend
- `npm start` – run built production server
- `npm run preview` – Vite preview
- `npm run clean` – remove generated build artifacts

## API

### `POST /api/analyze`

Request body:

```json
{
  "decision": "Should I buy a car or use public transport?",
  "format": "pros-cons"
}
```

- `decision`: required string
- `format`: one of `pros-cons`, `comparison`, `swot`

The endpoint prompts Gemini and returns structured JSON tailored to the selected format.

## Notes

- The server retries transient Gemini errors (`429`/`503`) up to 3 attempts.
- In production, static frontend files are served from `dist/`.
