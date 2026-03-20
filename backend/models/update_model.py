from pydantic import BaseModel


class UpdateModel(BaseModel):
    city: str
    country: str
    start_date: str
    end_date: str