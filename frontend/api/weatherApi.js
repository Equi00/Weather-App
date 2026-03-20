import axios from "axios";

class WeatherService{
    url_backend = "http://localhost:8000/api/weather";


    async get_weather_request_by_city(city, country){
        try {
            const response = await axios.get(`${this.url_backend}/country/${country}/city/${city}`);
            return response.data;
        } catch (error) {
            let message = "Unexpected error";

            if (error.response) {
                message = error.response.data?.detail || message;
            }
            throw new Error(message);
        }
    }


    async get_city_weather_by_date_range(city, country, start_date, end_date){
        try {
            const response = await axios.get(`${this.url_backend}/country/${country}/city/${city}/date-range`, {
                params: {
                    start_date: start_date,
                    end_date: end_date
                }
            });
            return response.data;
        } catch (error) {
            let message = "Unexpected error";

            if (error.response) {
                message = error.response.data?.detail || message;
            }

            throw new Error(message);
        }
    }
}

const weatherService = new WeatherService();

export default weatherService;