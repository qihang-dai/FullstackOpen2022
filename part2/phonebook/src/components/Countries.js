import React from "react";
import axios from "axios";
import { useState, useEffect } from "react";

const WeatherData = ({ city }) => {

    const api_key = process.env.REACT_APP_API_KEY;
    const [weather, setWeatherData] = React.useState({});

    useEffect(() => {
        axios
        .get(
            `http://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${api_key}&units=metric`
        )
        .then((response) => {
            setWeatherData(response.data);
        });
    }, []);
    

    return (
        <>
          {weather.main ? (
            <div>
              <h2>Weather in {city}</h2>
              <div>Temperature {weather.main.temp}°C</div>
              <img
                alt="weather icon"
                src={`http://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`}
              />
              <div>Wind {weather.wind.speed} m/s</div>
            </div>
          ) : null}
        </>
      );
};


const CountryData = ({ country }) => {
    return (
        <div>
            <h1>{country[0].name.common}</h1>
            <div>capital {country[0].capital}</div>
            <div>population {country[0].population}</div>
            <h2>languages</h2>
            <ul>
            {Object.values(country[0].languages).map((language) => (
                <li key={language}>{language}</li>
            ))}
            </ul>
            <img src={country[0].flags.png} alt="flag" width="100" height="100" />
            <WeatherData city={country[0].capital} />
        </div>
        );
};


const Countries = ({ countries, filter, handleShowClick }) => {
    if (filter === "") {
        return <div></div>;
    } else if (countries.length > 10) {
        return <div>Too many matches, specify another filter</div>;
    } else if (countries.length === 1) {
        return (
            <CountryData country={countries} />
        );
    } else {
        return (
        <div>
            {countries.map((country) => (
            <div key={country.name.common}>
                {country.name.common}
                <button onClick={() => handleShowClick([country])}>show</button>
            </div>
            ))}
        </div>
        );
    }
};

export default Countries;