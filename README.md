# PS05: Adaptive Authentication and Suspicious Login Detection

A login system that scores the risk of each login attempt and responds with
allow, step-up verification, or block.

## Problem statement
Passwords alone are not enough. Stolen credentials, brute force and credential
stuffing let attackers log in as real users. This project records login context
and adapts authentication based on risk.

## Tech stack
- Backend: FastAPI, SQLAlchemy, SQLite, PyJWT, Argon2 (pwdlib)
- Frontend: React, Vite, Tailwind CSS, Axios

## Setup

### Backend
```bash
cd backend
python -m venv venv
venv\Scripts\activate        # Mac/Linux: source venv/bin/activate
pip install -r requirements.txt
```
Create `backend/.env`:
```
SECRET_KEY=<run: python -c "import secrets; print(secrets.token_hex(32))">
ACCESS_TOKEN_EXPIRE_MINUTES=30
```
Run: `uvicorn main:app --reload --port 8000`
API docs: http://localhost:8000/docs

### Frontend
```bash
cd frontend
npm install
npm run dev
```
Open http://localhost:5173

## Day 1 status
- Register, login (JWT), logout and a protected home page
- Every login attempt, successful or failed, is stored in `login_events`
- Passwords hashed with Argon2

## Security notes
- Plaintext passwords are never stored or logged.
- Login errors are generic to prevent account enumeration.
- The JWT is kept in localStorage for this local demo. Production systems
  should use secure, HTTP-only cookies.
