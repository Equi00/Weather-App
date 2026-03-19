from datetime import date
from pydantic import BaseModel

class WeatherRequest(BaseModel):
    city: str = ""
    start_date: str = ""
    end_date: str = ""
    weather_data: list = []