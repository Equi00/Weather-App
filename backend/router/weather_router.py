from datetime import date
from fastapi import APIRouter, Depends
from fastapi.responses import StreamingResponse
from database.database import get_db
from models.request_model import RequestModel
from models.update_model import UpdateModel
from services.weather_service import WeatherService

router = APIRouter(prefix="/api/weather", tags=["weather"])

def get_weather_service(db = Depends(get_db)):
    return WeatherService(db)


@router.get("/country/city", response_model=list[RequestModel])
def get_weather_request_by_city(
    city: str, 
    country: str,
    service: WeatherService = Depends(get_weather_service)):

    return service.find_weather_request_by_city(city, country)


@router.get("/country/city/date-range", response_model=RequestModel)
def get_city_weather_by_date_range(
    city: str, 
    country: str,
    start_date: date | str, 
    end_date: date | str, 
    service: WeatherService = Depends(get_weather_service)):

    return service.get_city_weather_by_date_range(city, country, start_date, end_date)


@router.get("/country/city/forecast", response_model=RequestModel)
def get_forecast_5_days(
    city: str, 
    country: str,
    service: WeatherService = Depends(get_weather_service)):

    return service.get_forecast_5_days(city, country)


@router.put("/{id}", response_model=RequestModel)
def update_weather_request_by_id(
    id: str,
    update_model: UpdateModel,
    service: WeatherService = Depends(get_weather_service)):

    return service.update_weather_request_by_id(id, update_model)


@router.get("/{id}/export/csv")
def export_data_csv_by_id(
    id: str,
    service: WeatherService = Depends(get_weather_service)):

    file, city, country = service.export_data_csv_by_id(id)

    return StreamingResponse(
        file, 
        media_type="text/csv", 
        headers={"Content-Disposition": f"attachment; filename=weather_data_{city}_{country}.csv"})


@router.delete("/{id}")
def delete_weather_request_by_id(
    id: str,
    service: WeatherService = Depends(get_weather_service)) -> dict:

    return service.delete_weather_request_by_id(id)