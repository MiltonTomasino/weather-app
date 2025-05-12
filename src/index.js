import "./style.css";
console.log("hello from index.js!");

const key = "?key=B2H2UQPZ5CHBGDQH52BCFXUPA"
const url = "https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/";
let city;

const WeatherApi = (() => {
    let cityData;

    async function fetchCityData(city = null) {
        try {
            let response = await fetch(url + `/${city}` + key);
            cityData = await response.json();
            console.log(cityData);

        } catch (error) {
            console.log(error);
        }
    }

    function fetchCurrentTemp() {
        return cityData.currentConditions.temp;
    }

    function fetchCityDays() {
        return cityData.days;
    }

    function fetchCity() {
        return cityData;
    }

    return {
        fetchCityData,
        fetchCurrentTemp,
        fetchCityDays,
        fetchCity
    }
})();


const DisplayInfo = (() => {
    let searchBtn = document.querySelector("#search-btn");
    let locationDiv = document.querySelector(".location");

    searchBtn.addEventListener("click", async (e) => {
        e.preventDefault();
        locationDiv.innerHTML = "";
        let search = document.querySelector("#search");
        let formattedSearch = formatSearch(search.value);
        await WeatherApi.fetchCityData(formattedSearch);
        search.value = "";
        displayLocation();
    })

    function formatSearch(term) {
        let res = term.trim();
        
        if (res.includes(" ")) {
            res = res.split(" ").join("_");
        }

        return res;
    }

    async function displayLocation() {
        let locationH1 = document.createElement("h1");
        let cityLocation = WeatherApi.fetchCity();

        locationH1.textContent = cityLocation.resolvedAddress;
        locationDiv.appendChild(locationH1);
    }

})();

