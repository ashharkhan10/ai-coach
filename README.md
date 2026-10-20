# AI Gym Coach

An AI personal trainer in your browser. Turn on your camera, pick an exercise, and the app counts your reps, checks your form in real time, and an AI voice coach corrects you mid-set.

**Live app:** https://ai-gym-coach-app.vercel.app

---

## Features

- **Real-time pose tracking.** 33 body points detected at about 30 fps, entirely on your device. Your video never leaves your computer.
- **5 exercises:** squats, push-ups, biceps curls, shoulder press and lunges.
- **Automatic rep and set counting**, with a rest timer between sets.
- **Form score (0–100)** per set, plus live tips like "Keep your chest up".
- **AI voice coach** that speaks when you start, when your form slips, after each set and at the end.
- **AI weekly plans.** Pick your days, level, exercises and session length, and the AI builds the plan.
- **History:** weekly stats, a streak, and progress charts for reps and form score.
- **7 badges** to unlock, such as First step, Century, Perfect form and On fire.
- **Accounts** with email and password, and a profile (age, height, weight, goal).

---

## Tech stack

| Part | Technology |
|---|---|
| Frontend | Next.js 16, React 19, TypeScript, Tailwind CSS |
| Pose detection | MediaPipe Pose Landmarker (runs in the browser) |
| Backend | FastAPI (Python 3.12) |
| Database | PostgreSQL on Supabase, through SQLAlchemy |
| Login | JWT tokens, with Argon2 password hashing |
| AI | Groq (`openai/gpt-oss-120b`) |
| Voice | Web Speech API (the browser's built-in voice) |
| Tests | Vitest (frontend), Pytest (backend) |
| Hosting | Vercel (frontend), Render (backend), GitHub Actions (CI) |

---

## How it works

```
Camera ──► MediaPipe (in browser) ──► 33 body points
                                         │
                                         ▼
                              Exercise detector
                     (joint angles → reps, form score, tips)
                                         │
                 ┌───────────────────────┼────────────────────────┐
                 ▼                       ▼                        ▼
           Live screen            Voice coach              Save workout
      (rep ring, sets, timer)   (asks backend → AI      (backend → database)
                                 → speaks the line)
```

1. **The browser** does all the camera work, so tracking is instant.
2. **Each exercise detector** measures joint angles. For example, a squat rep is counted when the knee angle drops below 100° and then rises back above 160°.
3. **The backend** stores accounts, workouts and badges, and talks to the AI for coaching lines and weekly plans.

---

## Project structure

```
ai-coach/
├── web/                         ← Frontend (what users see)
│   └── src/
│       ├── app/                 ← Pages: /login, /workout, /session, /history, /plan, /profile
│       ├── components/          ← Screen pieces, grouped by page
│       │   ├── auth/            ← Login & sign-up forms
│       │   ├── session/         ← Live workout screen (camera, rep ring, rest timer…)
│       │   ├── history/         ← Charts, badges, workout table
│       │   ├── plan/            ← Plan options form & day cards
│       │   └── ui/              ← Shared bits (header, buttons, text fields)
│       ├── hooks/               ← Logic used by screens (camera, tracking, voice coach…)
│       └── lib/                 ← Plain logic, no UI (easy to test)
│           ├── pose/            ← MediaPipe loading, angles, skeleton drawing
│           ├── exercises/       ← One file per exercise + rep counter + form score
│           ├── workout/         ← Sets, rest timer, workout flow
│           ├── coach/           ← When to speak, text-to-speech
│           └── api/             ← Calls to the backend
│
├── api/                         ← Backend (server)
│   ├── app/
│   │   ├── main.py              ← Starts the app and plugs in the routes
│   │   ├── config.py            ← Settings from .env
│   │   ├── database.py          ← Database connection
│   │   ├── models/              ← Database tables
│   │   ├── schemas/             ← Shape of data going in and out
│   │   ├── routes/              ← API endpoints (auth, workouts, coach, plans…)
│   │   ├── services/            ← Business logic (stats, badges, AI prompts)
│   │   └── security/            ← Passwords and login tokens
│   └── tests/                   ← Backend tests
│
└── .github/workflows/ci.yml     ← Runs all tests on every push
```

**Where to start reading:** `web/src/lib/exercises/squat.ts` shows how a rep is detected, and `api/app/routes/workouts.py` shows how a workout is saved.

---

## API endpoints

| Method | Path | What it does |
|---|---|---|
| GET | `/health` | Health check, used to keep the server awake |
| POST | `/auth/signup` | Create an account |
| POST | `/auth/login` | Log in, returns a token |
| GET / PUT | `/me` | Read or update your profile |
| POST | `/workouts` | Save a finished workout (and unlock badges) |
| GET | `/workouts` | Recent workouts |
| GET | `/stats` | Weekly totals, streak and chart data |
| GET | `/badges` | All badges, and which ones you've earned |
| POST | `/coach/feedback` | One spoken line from the AI coach |
| POST | `/plans/generate` | Create an AI weekly plan |
| GET | `/plans/latest` | Your latest plan |

Full interactive docs: `/docs` on the backend.

---

## Run it locally

**You need:** Node.js 24, Python 3.12, a free [Supabase](https://supabase.com) database and a free [Groq](https://console.groq.com) key.

**Backend:**

```bash
cd api
python -m venv venv
venv\Scripts\activate          # Mac/Linux: source venv/bin/activate
pip install -r requirements.txt
# copy .env.example to .env and fill in your values
uvicorn app.main:app --reload  # http://localhost:8000
```

**Frontend** (in a second terminal):

```bash
cd web
npm install
npm run dev                    # http://localhost:3000
```

**Tests:**

```bash
cd api && pytest
cd web && npm test
```

---

## Author

Built by **Ashhar Khan**: [GitHub @ashharkhan10](https://github.com/ashharkhan10)
