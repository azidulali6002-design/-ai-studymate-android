# AI StudyMate

**Your Personal AI Teacher. Anytime. Anywhere.**

AI StudyMate is an early-stage learning companion for school, college, and university students.

## What's in the repository now

- Responsive web landing page and study interface
- Interactive study prompt chips and tool selection
- FastAPI backend with an `/api/ask` AI tutor endpoint
- Separate tutor modes for tutoring, homework guidance, notes, quizzes, and study planning
- Server-side OpenAI API integration (the secret key is never placed in browser code)
- Health check at `/health`
- Render deployment blueprint

## Run the backend locally

1. Install Python 3.10 or newer.
2. Install dependencies: `pip install -r requirements.txt`
3. Copy `.env.example` to `.env` and add your server-side `OPENAI_API_KEY`.
4. Run: `uvicorn server.main:app --reload`
5. The API health check is available at `http://127.0.0.1:8000/health`.

The static website can be served locally (for example, with VS Code Live Server). For a deployed website, set `window.STUDYMATE_API_URL` to the deployed API base URL before loading `app.js`, or host the frontend and API under the same origin.

## Deploy the API

The included `render.yaml` can be used as a starting point for deployment on Render. Add `OPENAI_API_KEY` as a secret environment variable in the hosting dashboard. Set `ALLOWED_ORIGINS` to the exact website origin(s) before production; do not leave it as a wildcard for a public production deployment.

## Important setup notes

- The API code is committed, but it is **not deployed or live yet**.
- A valid OpenAI API key and an API billing-enabled account are required for live answers. ChatGPT subscriptions and API billing are separate.
- Never paste an API key into GitHub files, the website JavaScript, or a public chat.
- Before public launch, add user authentication, request rate limiting, usage limits, abuse protection, privacy controls, and monitoring.
- The current web tutor sends English as its default language. Language selection, PDF uploads, student accounts, and persistent chat history are not implemented yet.

## Roadmap

1. Deploy and test the AI tutor backend
2. Add language selection and conversation history
3. Add notes, quizzes, PDF chat, and study planner workflows
4. Add student accounts and secure data storage
5. Build and test the Android app
