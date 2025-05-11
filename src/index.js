console.log("hello from index.js!");

const key = "?key=B2H2UQPZ5CHBGDQH52BCFXUPA"
const url = "https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/";
let city;

const WeatherApi = (() => {
    let cityData;

    async function fetchCityData(city = null) {
        try {
            let response = await fetch(url + "/San_Francisco" + key);
            cityData = await response.json();
            console.log(cityData);

        } catch (error) {
            console.log(error);
        }
    }

    function fetchCurrentTemp() {
        return cityData.currentConditions.temp;
    }

    return {
        fetchCityData,
        fetchCurrentTemp,
    }
})();

