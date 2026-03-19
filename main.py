from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from router.weather_router import router as weather_router

app = FastAPI(
    title="Weather API",
    description="API to retrieve weather data for cities and date ranges.",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(weather_router)

@app.get("/")
def read_root():
    return {"message": "Welcome to the Weather API!"}