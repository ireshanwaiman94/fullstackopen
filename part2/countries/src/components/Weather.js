import { useState, useEffect } from 'react';
import axios from 'axios';

const Weather = ({ countryName }) => {
    const [weather, setWeather] = useState([])
    const api_key = process.env.REACT_APP_API_KEY
    useEffect(() => {
        axios
            .get(`https://api.openweathermap.org/data/2.5/weather?q=${countryName}&appid=${api_key}`)
            .then(response => {
                console.log("Weather", response);
                setWeather(response.data)
            })
    }, [])

    return (
        <div>
            <h2>Weather in {countryName}</h2>
            <p>temperature {weather.temperature} Celcius</p>
            <img src={weather.weather_icons} alt="weather icon" />
            <p>
                <strong>wind:</strong> {weather.wind_speed} km/h direction{" "}
                {weather.wind_dir}
            </p>
        </div>

    )
}
export default Weather;