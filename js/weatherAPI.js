/** клас отвечающий за получение данных о погоде с API*/

export class WeatherAPI {
    constructor() {
        this.param = {
            "url": "https://api.openweathermap.org/data/3.0/",
            "appid": "6d42c346d1f37410a1b21516988c76f1"
        };
    }

    async getWeatherData(cityName, units) {
        const weatherApiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&units=${units}&appid=${this.param.appid}`;

        try {
            const response = await fetch(weatherApiUrl);
            const weatherData = await response.json();

            const oneCallDataResponse = await fetch(`${this.param.url}onecall?lat=${weatherData.coord.lat}&lon=${weatherData.coord.lon}&exclude=minutely&units=${units}&appid=${this.param.appid}`);
            const oneCallData = await oneCallDataResponse.json();

            return {
                cityName: weatherData.name + ', ' + weatherData.sys.country,
                data: oneCallData
            }
        } catch (error) {
            throw new Error('Failed to fetch weather data. ' + error.message);
        }
    }
}