from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
from routers import predict, reports
import os
from dotenv import load_dotenv

load_dotenv()

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup: preload models
    from services.ml_pipeline import load_models
    print("[STARTUP] Preloading AI models...")
    load_models()
    print("[STARTUP] Models ready.")
    yield
    # Shutdown
    print("[SHUTDOWN] Cleaning up...")

app = FastAPI(title="Femlytix AI Backend", version="2.0.0", lifespan=lifespan)

# CORS setup
origins = [
    "http://localhost:3000",
    "http://localhost:3001",
    "https://pcos-platform.vercel.app"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(predict.router)
app.include_router(reports.router)

@app.get("/health")
def root():
    return {"status": "healthy", "service": "PCOS AI Backend v2.0"}
