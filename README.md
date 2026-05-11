# Desafio Tecnico AFL - Conrado

Aplicação completa (API + Frontend) para gerenciar uma lista de tarefas (to-do list) com autenticação de usuário.

## Stack

- Backend: FastAPI, SQLAlchemy, SQLite, PyJWT
- Frontend: React, Vite, Axios

## Requisitos

- Python 3.12+
- Node.js 20+
- npm

## Backend

Crie e ative um ambiente virtual:

Windows PowerShell:

```powershell
python -m venv .venv
.\.venv\Scripts\Activate.ps1
```

Linux ou macOS:

```bash
python -m venv .venv
source .venv/bin/activate
```

Instale as dependências:

```bash
pip install -r requirements.txt
```

Defina variaveis de ambiente (Opcional):

```bash
SECRET_KEY=uma-chave-segura
DATABASE_URL=sqlite:///./teste.db
```

Inicie a API:

```bash
python -m uvicorn backend.main:app --reload
```

API:

- `http://127.0.0.1:8000`
- `http://127.0.0.1:8000/docs`

## Frontend

Em outro terminal:

```bash
cd frontend
npm install
npm run dev
```

Frontend:

- `http://localhost:5173`

## Fluxo de uso

1. Acesse `/register` para criar um usuario.
2. Faça login em `/login`.
3. Gerencie as tarefas na tela principal.

## Observações

- O banco SQLite e criado automaticamente na primeira execução.
- O backend filtra as tarefas por usuario autenticado.
- O login usa `application/x-www-form-urlencoded`, compativel com `OAuth2PasswordRequestForm`.
