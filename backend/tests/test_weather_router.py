from datetime import date, timedelta
from bson import ObjectId
from fastapi.testclient import TestClient
from pymongo import MongoClient
from database.database import get_db
from main import app
import pytest

from models.update_model import UpdateModel

client = TestClient(app)



@pytest.fixture(scope="function")
def db():
    client = MongoClient("localhost", 27017)
    db = client["Weather_db_test"]

    yield db

    client.drop_database("Weather_db_test")
    client.close()


@pytest.fixture(scope="function")
def service(db):

    def _get_test_db():
        return db
    
    app.dependency_overrides[get_db] = _get_test_db

    yield db

    app.dependency_overrides.pop(get_db, None)


def test_get_weather_request_by_city_success(service):
    response = client.get("/api/weather/country/city/date-range", 
                          params={"city": "cordoba", "country": "AR", "start_date": "2024-01-01", "end_date": "2024-01-03"})
    

    assert response.status_code == 200

    weather_request = response.json()

    response = client.get("/api/weather/country/city", params={"city": "cordoba", "country": "AR"})

    assert response.status_code == 200

    data = response.json()

    assert data[0]["city"] == weather_request["city"]
    assert data[0]["start_date"] == weather_request["start_date"]
    assert data[0]["end_date"] == weather_request["end_date"]
    assert data[0]["weather_data"] == weather_request["weather_data"]


def test_get_city_weather_by_date_range_success(service):
    response = client.get("/api/weather/country/city/date-range", 
                          params={"city": "buenos aires", "country": "AR", "start_date": "2024-01-01", "end_date": "2024-01-03"})
    
    assert response.status_code == 200

    data = response.json()
    
    assert data["city"] == "buenos aires"
    assert data["start_date"] == "2024-01-01"
    assert data["end_date"] == "2024-01-03"
    assert len(data["weather_data"]) > 0

    collection = service["weather_data"]

    saved_data = collection.find_one({"city": "buenos aires"})

    assert saved_data is not None
    assert saved_data["city"] == "buenos aires"
    assert saved_data["start_date"] == "2024-01-01"
    assert saved_data["end_date"] == "2024-01-03"
    assert len(saved_data["weather_data"]) > 0


def test_get_forecast_5_days_success(service):
    response = client.get("/api/weather/country/city/forecast", params={"city": "buenos aires", "country": "AR"})

    assert response.status_code == 200

    data = response.json()
    
    assert data["city"] == "buenos aires"
    assert data["start_date"] == date.today().isoformat()
    assert data["end_date"] == (date.today() + timedelta(days=4)).isoformat()
    assert len(data["weather_data"]) == 5

    saved_data = service["weather_data"].find_one({"city": "buenos aires"})

    assert saved_data is not None
    assert saved_data["city"] == "buenos aires"
    assert saved_data["start_date"] == date.today().isoformat()
    assert saved_data["end_date"] == (date.today() + timedelta(days=4)).isoformat()
    assert len(saved_data["weather_data"]) == 5


def test_update_weather_request_by_id_success(service):
    create_request = client.get("/api/weather/country/city/date-range", 
                                params={"city": "buenos aires", "country": "AR", "start_date": "2024-01-01", "end_date": "2024-01-03"})
    assert create_request.status_code == 200

    request_found = client.get("/api/weather/country/city", params={"city": "buenos aires", "country": "AR"})
    data = request_found.json()

    update_model = UpdateModel(city="cordoba", country="ES", start_date="2024-01-06", end_date="2024-01-10")
    update = client.put(f"/api/weather/{data[0]['id']}", json=update_model.model_dump())
    assert update.status_code == 200

    updated_data = update.json()
    collection = service["weather_data"]
    saved_data = collection.find_one({"_id": ObjectId(data[0]['id'])})

    assert saved_data is not None
    assert data[0]["city"] != updated_data["city"]
    assert saved_data["city"] == updated_data["city"]
    assert saved_data["start_date"] == updated_data["start_date"]
    assert saved_data["end_date"] == updated_data["end_date"]


def test_update_weather_request_by_id_whitout_dates(service):
    create_request = client.get("/api/weather/country/city/date-range", 
                                params={"city": "buenos aires", "country": "AR", "start_date": "2024-01-01", "end_date": "2024-01-03"})
    assert create_request.status_code == 200

    request_found = client.get("/api/weather/country/city", params={"city": "buenos aires", "country": "AR"})
    data = request_found.json()

    update_model = UpdateModel(city="cordoba", country="AR", start_date="", end_date="")
    response = client.put(f"/api/weather/{data[0]['id']}", json=update_model.model_dump())
    
    assert response.status_code == 200


def test_delete_weather_request_by_id_success(service):
    create_request = client.get("/api/weather/country/city/date-range", 
                                params={"city": "buenos aires", "country": "AR", "start_date": "2024-01-01", "end_date": "2024-01-03"})
    assert create_request.status_code == 200

    request_found = client.get("/api/weather/country/city", params={"city": "buenos aires", "country": "AR"})
    data = request_found.json()

    delete_response = client.delete(f"/api/weather/{data[0]['id']}")
    assert delete_response.status_code == 200
    assert delete_response.json()["message"] == f"Weather request with id {data[0]['id']} has been deleted successfully"

    collection = service["weather_data"]
    deleted_data = collection.find_one({"_id": ObjectId(data[0]['id'])})

    assert deleted_data is None


def test_download_csv_by_id_success(service):
    create_request = client.get("/api/weather/country/city/date-range", 
                                params={"city": "buenos aires", "country": "AR", "start_date": "2024-01-01", "end_date": "2024-01-03"})
    assert create_request.status_code == 200

    request_found = client.get("/api/weather/country/city", params={"city": "buenos aires", "country": "AR"})
    data = request_found.json()

    response = client.get(f"/api/weather/{data[0]['id']}/export/csv")

    assert response.status_code == 200
    assert "text/csv" in response.headers["Content-Type"]
    assert f"attachment; filename=weather_data_buenos_aires_AR.csv" in response.headers["Content-Disposition"]


def test_download_csv_by_id_not_found(service):
    response = client.get(f"/api/weather/{ObjectId()}/export/csv")

    assert response.status_code == 404
    assert response.json()["detail"] == f"Weather request with id {response.request.url.path.split('/')[-3]} not found"


def test_delete_weather_request_by_id_not_found(service):
    response = client.delete(f"/api/weather/{ObjectId()}")
    assert response.status_code == 404
    assert response.json()["detail"] == f"Weather request with id {response.request.url.path.split('/')[-1]} not found"


def test_update_weather_request_by_id_not_found(service):
    update_model = UpdateModel(city="cordoba", country="AR", start_date="2024-01-06", end_date="2024-01-10")    
    response = client.put(f"/api/weather/{ObjectId()}", json=update_model.model_dump())
    assert response.status_code == 404
    assert response.json()["detail"] == f"Weather request with id {response.request.url.path.split('/')[-1]} not found"


def test_update_weather_request_by_id_invalid_dates(service):
    create_request = client.get("/api/weather/country/city/date-range", 
                                params={"city": "buenos aires", "country": "AR", "start_date": "2024-01-01", "end_date": "2024-01-03"})
    assert create_request.status_code == 200

    request_found = client.get("/api/weather/country/city", params={"city": "buenos aires", "country": "AR"})
    data = request_found.json()

    update_model = UpdateModel(city="cordoba", country="AR", start_date="2024-01-10", end_date="2024-01-06")
    response = client.put(f"/api/weather/{data[0]['id']}", json=update_model.model_dump())
    
    assert response.status_code == 400
    assert response.json()["detail"] == "Start date must be before end date"


def test_update_weather_request_by_id_invalid_city(service):
    create_request = client.get("/api/weather/country/city/date-range", 
                                params={"city": "buenos aires", "country": "AR", "start_date": "2024-01-01", "end_date": "2024-01-03"})
    assert create_request.status_code == 200

    request_found = client.get("/api/weather/country/city", params={"city": "buenos aires", "country": "AR"})
    data = request_found.json()

    update_model = UpdateModel(city="InvalidCityName123", country="AR", start_date="2024-01-06", end_date="2024-01-10")
    response = client.put(f"/api/weather/{data[0]['id']}", json=update_model.model_dump())
    
    assert response.status_code == 404
    assert response.json()["detail"] == "City not found in country AR: InvalidCityName123"


def test_update_weather_request_by_id_future_dates(service):
    create_request = client.get("/api/weather/country/city/date-range", 
                                params={"city": "buenos aires", "country": "AR", "start_date": "2024-01-01", "end_date": "2024-01-03"})
    assert create_request.status_code == 200

    request_found = client.get("/api/weather/country/city", params={"city": "buenos aires", "country": "AR"})
    data = request_found.json()

    future_date = (date.today() + timedelta(days=10)).isoformat()
    update_model = UpdateModel(city="cordoba", country="AR", start_date=future_date, end_date=future_date)
    response = client.put(f"/api/weather/{data[0]['id']}", json=update_model.model_dump())
    
    assert response.status_code == 400
    assert response.json()["detail"] == "Dates cannot be in the future"


def test_get_forecast_5_days_invalid_city(service):
    response = client.get("/api/weather/country/city/forecast", params={"city": "InvalidCityName123", "country": "AR"})
    
    assert response.status_code == 404
    assert response.json()["detail"] == "City not found in country AR: InvalidCityName123"


def test_get_city_weather_by_date_range_future_dates(service):
    future_date = (date.today() + timedelta(days=10)).isoformat()
    response = client.get(f"/api/weather/country/city/date-range", params={"city": "Buenos Aires", "country": "AR", "start_date": future_date, "end_date": future_date})
    
    assert response.status_code == 400
    assert response.json()["detail"] == "Dates cannot be in the future"


def test_get_city_weather_by_date_range_invalid_dates(service):
    response = client.get("/api/weather/country/city/date-range", params={"city": "Buenos Aires", "country": "AR", "start_date": "2024-01-03", "end_date": "2024-01-01"})
    
    assert response.status_code == 400
    assert response.json()["detail"] == "Start date must be before end date"


def test_get_city_weather_by_date_range_invalid_city(service):
    response = client.get("/api/weather/country/city/date-range", params={"city": "InvalidCityName123", "country": "AR", "start_date": "2024-01-01", "end_date": "2024-01-03"})
    
    assert response.status_code == 404
    assert response.json()["detail"] == "City not found in country AR: InvalidCityName123"


def test_get_weather_request_by_city_invalid_city(service):
    city=""
    response = client.get(f"/api/weather/country/city", params={"city": city, "country": "AR"})

    assert response.status_code == 400
    assert response.json()["detail"] == "City and country parameters are required"

def test_get_weather_request_by_city_invalid_country(service):
    country=""
    response = client.get(f"/api/weather/country/city", params={"city": "Buenos Aires", "country": country})

    assert response.status_code == 400
    assert response.json()["detail"] == "City and country parameters are required"

def test_get_weather_request_by_city_no_data(service):
    response = client.get(f"/api/weather/country/city", params={"city": "NonExistentCity", "country": "AR"})

    assert response.status_code == 200
    assert response.json() == []

def test_get_weather_request_by_no_dates(service):
    response = client.get("/api/weather/country/city/date-range", params={"city": "buenos aires", "country": "AR", "start_date": "", "end_date": ""})
    
    assert response.status_code == 400
    assert response.json()["detail"] == "Dates parameter are required"

    response = client.get("/api/weather/country/city/date-range", params={"city": "buenos aires", "country": "AR", "start_date": "2024-06-06", "end_date": ""})
    
    assert response.status_code == 400
    assert response.json()["detail"] == "Dates parameter are required"

    response = client.get("/api/weather/country/city/date-range", params={"city": "buenos aires", "country": "AR", "start_date": "", "end_date": "2024-06-06"})
    
    assert response.status_code == 400
    assert response.json()["detail"] == "Dates parameter are required"