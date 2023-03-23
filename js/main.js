/** клас отвечающий за отображение информации на страницы */
import { WeatherUI } from './weatherUI.js';
document.addEventListener('DOMContentLoaded', () => {
    const weatherUI = new WeatherUI();
    weatherUI.initialize();
});