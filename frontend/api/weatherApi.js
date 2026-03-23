import axios from "axios";

class WeatherService{
    url_backend = "http://localhost:8000/api/weather";


    async get_weather_request_by_city(city, country){
        try {
            const response = await axios.get(`${this.url_backend}/country/city`, {
                params: {
                    city: city,
                    country: country
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


    async get_city_weather_by_date_range(city, country, start_date, end_date){
        try {
            const response = await axios.get(`${this.url_backend}/country/city/date-range`, {
                params: {
                    city: city,
                    country: country,
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

    async get_city_weather_forecast(city, country){
        try {
            const response = await axios.get(`${this.url_backend}/country/city/forecast`, {
                params: {
                    city: city,
                    country: country
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

    async update_weather_request_by_id(id, city, country, start_date, end_date){        
        try{
            const response = await axios.put(`${this.url_backend}/${id}`, 
                {
                    city: city,
                    country: country,
                    start_date: start_date,
                    end_date: end_date
                }
            )
            return response.data
        }catch (error){
            let message = "Unexpected error";

            if (error.response) {
                message = error.response.data?.detail || message;
            }

            throw new Error(message);
        }
    }

    async exportCSV(id) {
        try {
            const response = await axios.get(`${this.url_backend}/${id}/export/csv`,
                {
                    responseType: "blob",
                }
            );

            const url = window.URL.createObjectURL(new Blob([response.data]));

            const link = document.createElement("a");
            link.href = url;

            const contentDisposition = response.headers["content-disposition"];
            let filename = "weather_data.csv";

            if (contentDisposition) {
            const match = contentDisposition.match(/filename="?(.+)"?/);
            if (match?.[1]) {
                filename = match[1];
            }
            }

            link.setAttribute("download", filename);
            document.body.appendChild(link);

            link.click();

            link.remove();
            window.URL.revokeObjectURL(url);

        } catch (error) {
            let message = "Error downloading file";

            if (error.response) {
            message = error.response.data?.detail || message;
            }

            throw new Error(message);
        }
    }

    async delete_weather_request_by_id(id){
        try{
            const response = await axios.delete(`${this.url_backend}/${id}`)
            return response.data
        }catch (error){
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