# RiosF5

Projeto RiosF5 - Backend (Flask) + Frontend (Vite + React)

Estrutura:
- `backend/riosf5-backend` - Flask API
- `frontend/riosf5-frontend` - React + Vite frontend

Como rodar localmente:

Backend:
```bash
cd backend/riosf5-backend
python -m venv .venv
. .venv/bin/activate  # ou .venv\Scripts\activate no Windows
pip install -r requirements.txt
python -m src.main
```

Frontend:
```bash
cd frontend/riosf5-frontend
npm install --legacy-peer-deps
npm run dev
```

Deploy sugerido: Render (2 serviços) ou único serviço backend que serve o `dist` do frontend.
