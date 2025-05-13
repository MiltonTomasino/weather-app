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

    function fetchIconFromList(icon) {
        return baseUrl + icon + ".svg";
    }

    return {
        fetchCityData,
        fetchCurrentTemp,
        fetchCityDays,
        fetchCity,
        fetchIcon,
        fetchIconFromList
    }
})();


const DisplayInfo = (() => {
    let searchBtn = document.querySelector("#search-btn");
    let locationDiv = document.querySelector(".location");
    let main = document.querySelector(".main");
    let mainInfo = document.querySelector(".main-info");
    let days = document.querySelector(".days")

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
        displayAdditionMainInfo(city);
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

        mainInfoFeels(city);
        mainInfoHumidity(city);
        mainInfoUV(city);
        mainInfoSunsetSunrise(city);
        nextDayWeather(city);
        mainInfoLatLong(city);
        mainInfoTimezone(city);

    }

    function mainInfoFeels(city) {
        let feels = document.querySelector(".feels");
        feels.innerHTML = "";

        let header2 = document.createElement("h2");
        header2.textContent = "Feels like " + city.currentConditions.feelslike + "\u00B0F";

        feels.appendChild(header2);
    }

    function mainInfoHumidity(city) {
        let humidity = document.querySelector(".humidity");
        humidity.innerHTML = "";

        let header2 = document.createElement("h2");
        header2.textContent = "Humidity: " + city.currentConditions.humidity + "%";

        humidity.appendChild(header2);
    }

    function mainInfoUV(city) {
        let uv = document.querySelector(".uv-info");
        uv.innerHTML = "";

        let headerText = document.createElement("h2");
        headerText.textContent = "UV Index";

        let index = document.createElement("h1");
        index.textContent = city.currentConditions.uvindex;

        let desc = document.createElement("p");
        desc.textContent = checkUVIndex(city.currentConditions.uvindex);

        uv.appendChild(headerText);
        uv.appendChild(index);
        uv.appendChild(desc);
    }

    function checkUVIndex(uv) {
        if (uv > 0 && uv < 3) {
            return "Low";
        } else if (uv >= 3 && uv < 7) {
            return "Moderate";
        } else if (uv >= 7 && uv < 9) {
            return "High";
        } else if (uv >= 9 && uv < 11) {
            return "Very High";
        } else {
            return "Extreme";
        }
    }

    function mainInfoSunsetSunrise(city) {
        let setRise = document.querySelector(".sunset-sunrise");
        setRise.innerHTML = "";

        let header1 = document.createElement("h2");
        let header2 = document.createElement("h2");

        header1.textContent = "Sunrise: " + city.currentConditions.sunrise;
        header2.textContent = "Sunset: " + city.currentConditions.sunset;

        setRise.appendChild(header1)
        setRise.appendChild(header2);
    }

    function mainInfoLatLong(city) {
        let latLong = document.querySelector(".lat-long");
        latLong.innerHTML = "";

        let header1 = document.createElement("h2");
        let header2 = document.createElement("h2");

        header1.textContent = `Latitude: ${city.latitude}`;
        header2.textContent = `Longitude: ${city.longitude}`;

        latLong.appendChild(header1);
        latLong.appendChild(header2);
    }

    function mainInfoTimezone(city) {
        let timezone = document.querySelector(".timezone");
        timezone.innerHTML = "";

        let header1 = document.createElement("h2");
        let header2 = document.createElement("h2");

        header1.textContent = "Timezone:";
        header2.textContent = city.timezone.split("_").join(" ");

        timezone.appendChild(header1);
        timezone.appendChild(header2);
    }

    function nextDayWeather(city) {
        days.innerHTML = "";

        for (let i = 0; i < city.days.length; i++) {
            let box = document.createElement("div");
            box.classList.add("box");

            let icon = WeatherApi.fetchIconFromList(city.days[i].icon);

            let image = document.createElement("img");
            image.src = icon;

            let temp = document.createElement("h1");
            temp.textContent = `${city.days[i].temp} \u00B0 F`;

            let dateTime = document.createElement("h2");
            let date = city.days[i].datetime.split("-");
            let formattedDate = `${date[1]}/${date[2]}/${date[0]}`;
            dateTime.textContent = formattedDate;

            box.appendChild(temp);
            box.appendChild(image);
            box.appendChild(dateTime);

            days.appendChild(box);
        }

    }

})();

