from pydantic import BaseModel


class UpdateModel(BaseModel):
    city: str
    start_date: str
    end_date: str