from bson import ObjectId
import requests
from datetime import date, timedelta
from entities.weather_request import WeatherRequest
from fastapi import HTTPException
from models.request_model import RequestModel
from models.update_model import UpdateModel

URL_OPEN_METEO_SEARCH = "https://geocoding-api.open-meteo.com/v1/search"
URL_OPEN_METEO_ARCHIVE = "https://archive-api.open-meteo.com/v1/archive"
URL_OPEN_METEO_FORECAST = "https://api.open-meteo.com/v1/forecast"

class WeatherService:

    def __init__(self, db):
        self.db = db
        self.collection = self.db["weather_data"]


    def find_weather_request_by_city(self, city: str) -> list[RequestModel]:
        weather_data = self.collection.find({"city": city.lower()})

        list_data = []

        for doc in weather_data:
                doc["id"] = str(doc["_id"])
                del doc["_id"]  

                list_data.append(RequestModel(**doc))

        return list_data


    def get_city_weather_by_date_range(self, city: str, start_date: date, end_date: date) -> WeatherRequest:
        self._validate_date_range(start_date, end_date)
        
        latitude, longitude = self._get_city_coordinates(city)
        params = {
            'latitude': latitude,
            'longitude': longitude,
            'start_date': start_date,
            'end_date': end_date,
            'daily': 'temperature_2m_min,temperature_2m_max,precipitation_sum',
            'timezone': 'auto'
        }

        try:
            weather_request = self._get_weather_request(URL_OPEN_METEO_ARCHIVE, params, city, start_date, end_date)

            self.collection.insert_one(weather_request.model_dump())

            return weather_request
        
        except requests.exceptions.RequestException as e:
            raise HTTPException(status_code=400, detail=f"Could not retrieve weather data for city: {city} and date range: {start_date} to {end_date}. \nError: {str(e)}")
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Unexpected error: {str(e)}")           


    def get_forecast_5_days(self, city: str) -> WeatherRequest:
        latitude, longitude = self._get_city_coordinates(city)

        params = {
            'latitude': latitude,
            'longitude': longitude,
            'daily': 'temperature_2m_min,temperature_2m_max,precipitation_sum',
            'timezone': 'auto'
        }

        try:
            weather_request = self._get_weather_request(URL_OPEN_METEO_FORECAST, params, city, date.today(), date.today() + timedelta(days=4))

            self.collection.insert_one(weather_request.model_dump())

            return weather_request
        
        except requests.exceptions.RequestException as e:
            raise HTTPException(status_code=400, detail=f"Could not retrieve 5-day forecast data. \nError: {str(e)}")
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Unexpected error: {str(e)}")


    def update_weather_request_by_id(self, id: str, update_model: UpdateModel) -> WeatherRequest:
        old_request = self.collection.find_one({"_id": ObjectId(id)})

        if not old_request:
            raise HTTPException(status_code=404, detail=f"Weather request with id {id} not found")

        self._validate_date_range(date.fromisoformat(update_model.start_date), date.fromisoformat(update_model.end_date))

        latitude, longitude = self._get_city_coordinates(update_model.city)

        params = {
            'latitude': latitude,
            'longitude': longitude,
            'start_date': update_model.start_date,
            'end_date': update_model.end_date,
            'daily': 'temperature_2m_min,temperature_2m_max,precipitation_sum',
            'timezone': 'auto'
        }

        try:
            new_request: WeatherRequest = self._get_weather_request(URL_OPEN_METEO_ARCHIVE, params, update_model.city, update_model.start_date, update_model.end_date)

            self.collection.update_one(
                {"_id": ObjectId(id)},
                {"$set": new_request.model_dump()},
                upsert=False
            )

            return new_request
        
        except requests.exceptions.RequestException as e:
            raise HTTPException(
                status_code=400, 
                detail=f"Could not update weather data for city: {update_model.city} and date range: {update_model.start_date} to {update_model.end_date}. \nError: {str(e)}")
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Unexpected error: {str(e)}")


    def delete_weather_request_by_id(self, id: str):
        result = self.collection.delete_one({"_id": ObjectId(id)})

        if result.deleted_count == 0:
            raise HTTPException(status_code=404, detail=f"Weather request with id {id} not found")

        return {"message": f"Weather request with id {id} has been deleted successfully"}


    def _get_city_coordinates(self, city: str) -> tuple:
        params = {
            'name': city.lower(),
            'count': 1
        }

        response = requests.get(URL_OPEN_METEO_SEARCH, params=params)
        data = response.json()
            
        if "results" in data:
            result = data['results'][0]
            return result['latitude'], result['longitude']
        else:
            raise HTTPException(status_code=404, detail=f"City not found: {city}")


    def _validate_date_range(self, start_date: date, end_date: date):
        if start_date > end_date:
            raise HTTPException(status_code=400, detail="Start date must be before end date")
        
        if start_date > date.today() or end_date > date.today():
            raise HTTPException(status_code=400, detail="Dates cannot be in the future")
        

    def _get_weather_request(self, url: str, params: dict, city: str, start_date: date, end_date: date) -> WeatherRequest:
            response = requests.get(url, params=params)
            data = response.json()

            daily = data.get("daily", {})

            if not daily or not daily.get("time"):
                raise HTTPException(status_code=404, detail=f"No weather data found for {city}")

            _weather_data = []

            if "forecast" in url:
                for i, date_str in enumerate(daily.get("time", [])):
                    if i == 5:
                        break
                    
                    _weather_data.append({
                        "date": date_str,
                        "temperature_min": daily.get("temperature_2m_min", [])[i],
                        "temperature_max": daily.get("temperature_2m_max", [])[i],
                        "precipitation_sum": daily.get("precipitation_sum", [])[i]
                    })
            else:
                for i, date_str in enumerate(daily.get("time", [])):
                    _weather_data.append({
                        "date": date_str,
                        "temperature_min": daily.get("temperature_2m_min", [])[i],
                        "temperature_max": daily.get("temperature_2m_max", [])[i],
                        "precipitation_sum": daily.get("precipitation_sum", [])[i]
                    })

            weather_request = WeatherRequest(
                city=city.lower(),
                start_date=str(start_date),
                end_date=str(end_date),
                weather_data=_weather_data
            )

            return weather_request