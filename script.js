const param = {
    "url": "https://api.openweathermap.org/data/3.0/",
    "appid": "6d42c346d1f37410a1b21516988c76f1"
}

let units = 'metric';
let currentCity = {
    lat: 50.45466,
    lon: 30.5238
};

document.addEventListener('DOMContentLoaded', function () {
    const cityInput = document.querySelector('#city-input');

    const savedWeatherData = localStorage.getItem('weatherData');


    if (savedWeatherData) {
        const weatherData = JSON.parse(savedWeatherData);

        showWeather(weatherData.current, weatherData.cityName);
    } else {
        getWeather(currentCity.lat, currentCity.lon);
    }

    fetch('city.list.json')
        .then(response => response.json()) //обрабатывает полученный ответ от сервера в формате JSON и возвращает его как результат.
        .then(data => {
            const cities = data;


            cityInput.addEventListener('keydown', event => {
                if (event.key === 'Enter') {
                    const cityName = cityInput.value;
                    const city = cities.find(c => c.name === cityName);

                    if (city) {
                        currentCity.lat = city.coord.lat;
                        currentCity.lon = city.coord.lon;
                        getWeather(currentCity.lat, currentCity.lon);
                        cityInput.value = '';
                    } else {
                        console.log(`Город ${cityName} не найден`);
                    }
                }
            });
        })
        .then(() => {
            const switchContainer = document.querySelector('.switch-container')
            const metric = document.querySelector('#metric')
            const imperial = document.querySelector('#imperial')

            switchContainer.addEventListener('click', (e)=> {

                if (e.target === metric) {
                    units = 'metric'
                    metric.classList.add('selected')
                    imperial.classList.remove('selected')

                } else {
                    units = 'imperial'
                    metric.classList.remove('selected')
                    imperial.classList.add('selected')

                }
                getWeather(currentCity.lat, currentCity.lon);
            })
        })

    function getCityName(lat, lon, callback) {
        fetch(`https://api.openweathermap.org/geo/1.0/reverse?lat=${lat}&lon=${lon}&appid=${param.appid}`)
            .then(response => response.json())
            .then(data => {
                const cityName = data[0].name;
                callback(cityName);
            })
            .catch(error => console.log(error));
    }

    function getWeather(lat, lon) {
        fetch(`${param.url}onecall?lat=${lat}&lon=${lon}&units=${units}&appid=${param.appid}`)
            .then(weather => {
                return weather.json();
            })
            .then(data => {
                getCityName(lat, lon, cityName => {
                    showWeather(data, cityName);
                });
            })
            .catch(error => console.log(error));
    }

    function showWeather(data, cityName) {

        console.log(data);
        document.querySelector('.city-name').textContent = cityName;
        document.querySelector('.temp-data').innerHTML = units === 'metric' ? Math.round(data.current.temp) + '&degC' : Math.round(data.current.temp) + '&degF';
        document.querySelector('.desc').textContent = data.current.weather[0].description;
        document.querySelector('#main__image').innerHTML = `<img src='https://openweathermap.org/img/wn/${data.current.weather[0].icon}@4x.png'>`;

        document.querySelector('#real-feel').innerHTML = units === 'metric' ? Math.round(data.current.feels_like) + '&degC' : Math.round(data.current.feels_like) + '&degF';
        document.querySelector('#humidity').innerHTML = data.current.humidity + '%';

        document.querySelector('#wind').innerHTML = units === 'metric' ? data.current.wind_speed + 'm/sec' : data.current.wind_speed + 'mph';
        document.querySelector('#pressure').innerHTML = data.current.pressure + 'hPa';

        document.querySelector('#sunset').innerHTML = formatTime(data.current.sunset);
        document.querySelector('#sunrise').innerHTML = formatTime(data.current.sunrise);

        document.querySelector('#first-forecast-date').innerHTML = formatTime(data.hourly[0].dt);
        document.querySelector('#first-forecast-img').innerHTML = `<img src='https://openweathermap.org/img/wn/${data.hourly[0].weather[0].icon}@2x.png'>`;
        document.querySelector('#first-forecast-temp').innerHTML = Math.round(data.hourly[0].temp) + '&deg';

        document.querySelector('#second-forecast-date').innerHTML = formatTime(data.hourly[1].dt);
        document.querySelector('#second-forecast-img').innerHTML = `<img src='https://openweathermap.org/img/wn/${data.hourly[1].weather[0].icon}@2x.png'>`;
        document.querySelector('#second-forecast-temp').innerHTML = Math.round(data.hourly[1].temp) + '&deg';

        document.querySelector('#third-forecast-date').innerHTML = formatTime(data.hourly[2].dt);
        document.querySelector('#third-forecast-img').innerHTML = `<img src='https://openweathermap.org/img/wn/${data.hourly[2].weather[0].icon}@2x.png'>`;
        document.querySelector('#third-forecast-temp').innerHTML = Math.round(data.hourly[2].temp) + '&deg';

        document.querySelector('#fourth-forecast-date').innerHTML = formatTime(data.hourly[3].dt);
        document.querySelector('#fourth-forecast-img').innerHTML = `<img src='https://openweathermap.org/img/wn/${data.hourly[3].weather[0].icon}@2x.png'>`;
        document.querySelector('#fourth-forecast-temp').innerHTML = Math.round(data.hourly[3].temp) + '&deg';

        document.querySelector('#fifth-forecast-date').innerHTML = formatTime(data.hourly[4].dt);
        document.querySelector('#fifth-forecast-img').innerHTML = `<img src='https://openweathermap.org/img/wn/${data.hourly[4].weather[0].icon}@2x.png'>`;
        document.querySelector('#fifth-forecast-temp').innerHTML = Math.round(data.hourly[4].temp) + '&deg';


        let table = document.querySelector('#day-forecast');
        table.innerHTML = '';

        for (let i = 0; i < data.daily.length; i++) {

            let trow = document.createElement('tr')

            let dateCell = document.createElement('td');
            let date = new Date(data.daily[i].dt * 1000);
            let options = {weekday: 'short'};
            dateCell.textContent = date.toLocaleDateString('en-US', options);
            trow.append(dateCell);

            let imgCell = document.createElement('td');
            imgCell.innerHTML = `<img src='https://openweathermap.org/img/wn/${data.daily[i].weather[0].icon}@2x.png'>`
            trow.append(imgCell);

            let descCell = document.createElement('td');
            descCell.innerHTML = `<span>${data.daily[i].weather[0].description}</span>`
            trow.append(descCell);

            let tempCell = document.createElement('td');
            tempCell.innerHTML = `<span>${Math.round(data.daily[i].temp.day)}</span> / ${Math.round(data.daily[i].temp.eve)} &deg`
            console.log(data.daily[i].temp.day);
            trow.append(tempCell);

            table.classList.add('day-forecast')
            table.append(trow)
        }

        // сохраняем данные в localStorage
        const weatherData = {
            current: data,
            cityName: cityName
        };
        //чтобы данные обновлялись при перезагрузке страницы вешаем обработчик на глобальный обьект
        window.addEventListener('unload', function () {
            localStorage.setItem('weatherData', JSON.stringify(weatherData));
        });
    }

    function formatTime(datetime) {
        const date = new Date(datetime * 1000);
        const hours = date.getHours();
        const minutes = date.getMinutes();
        const ampm = hours >= 12 ? 'PM' : 'AM';
        const formattedHours = hours % 12 === 0 ? 12 : hours % 12;
        const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;
        return `${formattedHours}:${formattedMinutes} ${ampm}`;
    }
})