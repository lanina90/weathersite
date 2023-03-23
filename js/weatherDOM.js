/** клас отвечающий за элемнты DOM */
export class WeatherDOM {
    get cityInput() {
        return document.querySelector('#city-input');
    }

    get switchContainer() {
        return document.querySelector('.switch-container');
    }

    get metric() {
        return document.querySelector('#metric');
    }

    get imperial() {
        return document.querySelector('#imperial');
    }

    get city() {
        return document.querySelector('.city-name');
    }

    get tempData() {
        return document.querySelector('.temp-data');
    }

    get weatherDesc() {
        return document.querySelector('.desc');
    }
    get mainImg() {
        return document.querySelector('#main__image');
    }

    get realFeel() {
        return document.querySelector('#real-feel');
    }

    get humidity() {
        return document.querySelector('#humidity');
    }

    get wind() {
        return document.querySelector('#wind');
    }
    get pressure() {
        return document.querySelector('#pressure');
    }

    get sunset() {
        return document.querySelector('#sunset');
    }

    get sunrise() {
        return document.querySelector('#sunrise');
    }

    get forecastTable() {
        return document.querySelector('#day-forecast');
    }




}