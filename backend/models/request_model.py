from pydantic import BaseModel


class RequestModel(BaseModel):
    id: str
    city: str
    country: str
    start_date: str
    end_date: str
    map_url: str
    youtube_url: str
    weather_data: list