import "./style.css";
console.log("hello from index.js!");

const key = "?key=B2H2UQPZ5CHBGDQH52BCFXUPA"
const url = "https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/";
let city;

const WeatherApi = (() => {
    const baseUrl = "https://raw.githubusercontent.com/visualcrossing/WeatherIcons/refs/heads/main/SVG/4th%20Set%20-%20Color/"
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

    function fetchIcon(city) {
        return baseUrl + city.currentConditions.icon + ".svg";
    }

    return {
        fetchCityData,
        fetchCurrentTemp,
        fetchCityDays,
        fetchCity,
        fetchIcon
    }
})();


const DisplayInfo = (() => {
    let searchBtn = document.querySelector("#search-btn");
    let locationDiv = document.querySelector(".location");
    let main = document.querySelector(".main");
    let mainInfo = document.querySelector(".main-info");

    searchBtn.addEventListener("click", async (e) => {
        e.preventDefault();
        locationDiv.innerHTML = "";
        let search = document.querySelector("#search");
        let formattedSearch = formatSearch(search.value);
        await WeatherApi.fetchCityData(formattedSearch);
        search.value = "";
        let city = WeatherApi.fetchCity();

        displayLocation(city);
        displayMainInfo(city);
    })

    function formatSearch(term) {
        let res = term.trim();
        
        if (res.includes(" ")) {
            res = res.split(" ").join("_");
        }

        return res;
    }

    function displayLocation(city) {
        let locationH1 = document.createElement("h1");

        locationH1.textContent = city.resolvedAddress;
        locationDiv.appendChild(locationH1);
    }

    function displayMainInfo(city) {
        main.innerHTML= "";
        let icon = WeatherApi.fetchIcon(city);

        let image = document.createElement("img");
        image.src = icon;

        let temp = document.createElement("h1");
        temp.textContent = `${city.currentConditions.temp} \u00B0 F`;

        let conditions = document.createElement("p");
        conditions.textContent = city.currentConditions.conditions;

        main.appendChild(temp);
        main.appendChild(image);
        main.appendChild(conditions);
    }

    function displayAdditionMainInfo(city) {
        mainInfo.innerHTML = "";

        
    }

})();

