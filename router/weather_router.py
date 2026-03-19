from datetime import date
from fastapi import APIRouter, Depends
from database.database import get_db
from models.update_model import UpdateModel
from services.weather_service import WeatherService

router = APIRouter(prefix="/api/weather", tags=["weather"])

def get_weather_service(db = Depends(get_db)):
    return WeatherService(db)


@router.get("/city/{city}")
def get_weather_request_by_city(
    city: str, 
    service: WeatherService = Depends(get_weather_service)):

    return service.find_weather_request_by_city(city)


@router.get("/city/{city}/date-range")
def get_city_weather_by_date_range(
    city: str, 
    start_date: date, 
    end_date: date, 
    service: WeatherService = Depends(get_weather_service)):

    return service.get_city_weather_by_date_range(city, start_date, end_date)


@router.get("/city/{city}/forecast")
def get_forecast_5_days(
    city: str, 
    service: WeatherService = Depends(get_weather_service)):

    return service.get_forecast_5_days(city)


@router.put("/{id}")
def update_weather_request_by_id(
    id: str,
    update_model: UpdateModel,
    service: WeatherService = Depends(get_weather_service)):

    return service.update_weather_request_by_id(id, update_model)

@router.delete("/{id}")
def delete_weather_request_by_id(
    id: str,
    service: WeatherService = Depends(get_weather_service)):

    return service.delete_weather_request_by_id(id)