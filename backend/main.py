from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import inspect, text
from . import models
from .database import engine
from .routers.tasks import router as tasks_router
from .routers.users import router as users_router


def ensure_schema() -> None:
    with engine.begin() as connection:
        inspector = inspect(connection)
        if "tasks" not in inspector.get_table_names():
            return

        columns = {column["name"] for column in inspector.get_columns("tasks")}
        if "is_urgent" not in columns:
            connection.execute(
                text(
                    "ALTER TABLE tasks ADD COLUMN is_urgent BOOLEAN NOT NULL DEFAULT 0",
                ),
            )


models.Base.metadata.create_all(bind=engine)
ensure_schema()

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(users_router)
app.include_router(tasks_router)
