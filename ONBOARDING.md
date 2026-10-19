# Team Dignitas - Developer Onboarding & Git Workflow Guide

Welcome to **Team Dignitas**! This guide outlines our standard Git collaboration workflow, branch conventions, and local environment setup for the **Adaptive Authentication and Suspicious Login Detection** project (`ps05-adaptive-auth`).

---

## 1. Golden Rules of Collaboration

To prevent merge conflicts, accidental overwrites, and broken builds:
1. **Never push directly to `main`**: Always work on your own feature branch (`feature/<name>`) and open a Pull Request (PR) into `dev`.
2. **Pull before you code**: Run `git pull origin dev` at the start of every work session.
3. **Commit small, commit often**: Keep commits atomic and descriptive (e.g., `feat(auth): add IP velocity check calculation`).
4. **Separation of Concerns**:
   - Backend developers work exclusively inside `backend/`.
   - Frontend developers work exclusively inside `frontend/`.
   - Documentation & architecture go inside `docs/` or `README.md`.
5. **Zero Secrets in Git**: Never commit `.env`, secret keys, or `.db` files.

---

## 2. First-Time Setup (Windows PowerShell)

Open PowerShell and follow these exact steps:

### Step 1: Clone the Repository
```powershell
git clone https://github.com/LinsJM/ps05-adaptive-auth.git
cd ps05-adaptive-auth
```

### Step 2: Switch to the Shared `dev` Branch
```powershell
git checkout dev
```

### Step 3: Set Up Python Virtual Environment
Inside the project root:
```powershell
# Create virtual environment
python -m venv venv

# Activate virtual environment in PowerShell
.\venv\Scripts\Activate.ps1
```

> **Note for PowerShell execution policy error:**
> If you see `File Activate.ps1 cannot be loaded because running scripts is disabled`, run this once:
> ```powershell
> Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
> ```

### Step 4: Install Dependencies
```powershell
pip install --upgrade pip
pip install -r backend/requirements.txt
```

### Step 5: Configure Local Secrets (.env)
Never share secrets over chat. Generate your own local secret key:
```powershell
# Copy the example file to backend/.env
Copy-Item backend/.env.example backend/.env

# Generate a cryptographically secure 64-character secret key:
python -c "import secrets; print(secrets.token_hex(32))"
```
Open `backend/.env` in your editor and paste the generated string into `SECRET_KEY=...`.

### Step 6: Verify Backend Starts
```powershell
uvicorn backend.main:app --reload --port 8000
```
Open your browser at `http://127.0.0.1:8000` to verify the health check and API docs at `http://127.0.0.1:8000/docs`.

---

## 3. Daily Git Branching & Feature Workflow

### Branch Naming Conventions
- Features: `feature/<feature-name>` (e.g. `feature/login-telemetry`, `feature/risk-engine`)
- Bugfixes: `fix/<issue-name>` (e.g. `fix/ip-geoloc-timeout`)
- Docs: `docs/<topic>` (e.g. `docs/api-spec`)

### Daily Workflow Checklist

```powershell
# 1. Switch to dev and fetch latest updates
git checkout dev
git pull origin dev

# 2. Create your feature branch off dev
git checkout -b feature/login-page

# 3. Work on your code inside your assigned folder (e.g. frontend/ or backend/)

# 4. Check git status and stage your changes
git status
git add backend/   # only stage your relevant changes!

# 5. Commit with a clear message
git commit -m "feat(risk): implement impossible travel velocity heuristic"

# 6. Push your feature branch to GitHub
git push -u origin feature/login-page
```

### Opening a Pull Request (PR)
1. Go to GitHub and open a **Pull Request** targeting the `dev` branch (base: `dev` <- compare: `feature/<name>`).
2. Add a short summary of what you built/tested.
3. Request a review from at least one teammate (or Team Leader).
4. Once approved and merged, delete your remote feature branch.
