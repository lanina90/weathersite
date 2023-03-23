
/** клас отвечающий за отображение информации на страницы */
import { WeatherAPI } from './weatherAPI.js';
import { WeatherDOM } from './weatherDOM.js';
export class WeatherUI {
    constructor() {
        this.units = 'metric';
        this.currentCity = 'Kyiv';
        this.weatherAPI = new WeatherAPI();
        this.weatherDOM = new WeatherDOM();
        this.cityInput = this.weatherDOM.cityInput;
        this.switchContainer = this.weatherDOM.switchContainer;
        this.metric = this.weatherDOM.metric;
        this.imperial = this.weatherDOM.imperial;
    }

    initialize() {
        const savedWeatherData = localStorage.getItem('weatherData');
        if (savedWeatherData) {
            const weatherData = JSON.parse(savedWeatherData);
            this.showWeather(weatherData.data, weatherData.cityName);
        } else {
            this.getWeather(this.currentCity);
        }

        this.addEventListeners();
    }

    addEventListeners() {
        this.cityInput.addEventListener('keydown', event => {
            if (event.key === 'Enter') {
                const cityName = this.cityInput.value;
                this.getWeather(cityName);
                this.cityInput.value = '';
            }
        });

        this.switchContainer.addEventListener('click', (e) => {
            if (e.target === this.metric) {
                this.units = 'metric';
                this.imperial.classList.remove('selected');
                this.metric.classList.add('selected');

            } else {
                this.units = 'imperial'
                this.metric.classList.remove('selected');
                this.imperial.classList.toggle('selected');
            }
            this.getWeather(this.currentCity);
        })
    }

    async getWeather(cityName) {
        try {
            const weather = await this.weatherAPI.getWeatherData(cityName, this.units);
            this.showWeather(weather.data, weather.cityName);
            localStorage.setItem('weatherData', JSON.stringify(weather));
        } catch (error) {
            alert("The city not found", error);
        }
    }

    showWeather(data, cityName) {
        this.data = data;
        this.currentCity = cityName;

        this.updateCurrentWeather();
        this.updateHourlyForecast();
        this.updateDailyForecast();
    }


    updateCurrentWeather() {

        let windIconElement = document.createElement('i');
        windIconElement.className = 'fa-solid fa-up-long';
        windIconElement.style.transform = `rotate(${this.data.current.wind_deg}deg)`;
        let windIcon = windIconElement.outerHTML;

        this.weatherDOM.city.textContent = this.currentCity;
        this.weatherDOM.tempData.innerHTML = this.units === 'metric' ? Math.round(this.data.current.temp) + '&degC' : Math.round(this.data.current.temp) + '&degF';
        this.weatherDOM.weatherDesc.textContent = this.data.current.weather[0].description;
        this.weatherDOM.mainImg.innerHTML = `<img src='https://openweathermap.org/img/wn/${this.data.current.weather[0].icon}@4x.png'>`;

        this.weatherDOM.realFeel.innerHTML = this.units === 'metric' ? Math.round(this.data.current.feels_like) + '&degC' : Math.round(this.data.current.feels_like) + '&degF';
        this.weatherDOM.humidity.innerHTML = this.data.current.humidity + '%';

        this.weatherDOM.wind.innerHTML = this.units === 'metric' ? windIcon + ' ' + this.data.current.wind_speed + 'm/sec' : windIcon + ' ' + this.data.current.wind_speed + 'mph';
        this.weatherDOM.pressure.innerHTML = this.data.current.pressure + 'hPa';

        this.weatherDOM.sunset.innerHTML = WeatherUI.formatTime(this.data.current.sunset, this.data.timezone_offset);
        this.weatherDOM.sunrise.innerHTML = WeatherUI.formatTime(this.data.current.sunrise, this.data.timezone_offset);
    }

    updateHourlyForecast() {

        const forecasts = ['first', 'second', 'third', 'fourth', 'fifth'];

        for (let i = 0; i < forecasts.length; i++) {
            document.querySelector(`#${forecasts[i]}-forecast-date`).innerHTML = WeatherUI.formatTime(this.data.hourly[i].dt, this.data.timezone_offset);
            document.querySelector(`#${forecasts[i]}-forecast-img`).innerHTML = `<img src='https://openweathermap.org/img/wn/${this.data.hourly[i].weather[0].icon}@2x.png'>`;
            document.querySelector(`#${forecasts[i]}-forecast-temp`).innerHTML = `${Math.round(this.data.hourly[i].temp)}&deg;`;
        }
    }

    updateDailyForecast() {
        let table = this.weatherDOM.forecastTable;
        table.innerHTML = '';

        for (let i = 1; i < this.data.daily.length; i++) {
            let row = this.generateDailyForecastRow(this.data.daily[i]);
            table.classList.add('day-forecast');
            table.append(row);
        }
    }

    generateDailyForecastRow(dailyData) {
        let row = document.createElement('tr');

        let dateCell = document.createElement('td');
        let date = new Date(dailyData.dt * 1000);
        let options = {
            weekday: 'short',
            month: 'short',
            day: 'numeric'
        };
        dateCell.textContent = date.toLocaleDateString('en-US', options);
        row.append(dateCell);

        let imgCell = document.createElement('td');
        imgCell.innerHTML = `<img src='https://openweathermap.org/img/wn/${dailyData.weather[0].icon}@2x.png'>`;
        row.append(imgCell);

        let descCell = document.createElement('td');
        descCell.innerHTML = `<span>${dailyData.weather[0].description}</span>`;
        row.append(descCell);

        let tempCell = document.createElement('td');
        tempCell.innerHTML = `<span>${Math.round(dailyData.temp.day)}</span> / ${Math.round(dailyData.temp.eve)} &deg`;
        row.append(tempCell);

        return row;
    }

    static formatTime(datetime, timezoneOffset) {
        const date = new Date((datetime + timezoneOffset) * 1000);
        const hours = date.getUTCHours();
        const minutes = date.getMinutes();
        const ampm = hours >= 12 ? 'PM' : 'AM';
        const formattedHours = hours % 12 === 0 ? 12 : hours % 12;
        const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;
        return `${formattedHours}:${formattedMinutes} ${ampm}`;
    }
}
