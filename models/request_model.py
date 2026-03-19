from pydantic import BaseModel


class RequestModel(BaseModel):
    id: str
    city: str
    start_date: str
    end_date: str
    weather_data: list