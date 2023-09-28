document.addEventListener("DOMContentLoaded", function () {
    const apiKey = 'e44507219df7d6ac3ca356f334e2e087'; // Replace with your API key

    const weatherForm = document.getElementById("weatherForm");
    const locationInput = document.getElementById("locationInput");
    const searchButton = document.getElementById("searchButton");
    const unitSelector = document.getElementById("unitSelector");
    const geoLocationButton = document.getElementById("geoLocationButton");
    const weatherData = document.getElementById("weatherData");



    // window.onload = function() {
    //     fetchWeatherData('Delhi','metric');
    // };



    const displayWeatherData = (data, unit) => {
        const humidity = data.main.humidity;
        const temperature = data.main.temp;
        const description = data.weather[0].description;
        const cityName = data.name;


       
        let unitSymbol;

        if (unit === "metric") {
           
            unitSymbol = "°C";
        } else {
           
            unitSymbol = "°F";
        }

        let temperatureRounded = Math.round(temperature);

        const weatherHTML = `
    <h2>${cityName}</h2>
    <div class="columns">
        <div class="left-column">
            <p><span class="temperature-icon"><img src="images/drizzle.png" alt="Temperature Icon"></span>Temperature: ${temperatureRounded}${unitSymbol}</p>
            <br>
            <br>
            <br>
            <p><span class="humidity-icon"><img src="humidity.png" alt="Humidity Icon"></span>
            Humidity: ${humidity}%</p>
        </div>
        <div class="right-column">
            <p><span class="wind-icon"><img src="images/wind.png" alt="Wind Icon"></span>
            Wind Speed: ${data.wind.speed}${unit === "metric" ? " m/s" : " mph"}</p>
            <br>
            <br>
            <br>
            <p><span class="description-icon"><img src="images/drizzle.png" alt="Description Icon"></span>
            Weather: ${description}</p>
        </div>
    </div>
`;

weatherData.innerHTML = weatherHTML;

    };

    const handleWeatherError = (data) => {
        const errorMessage = data.message || "An error occurred while fetching data.";
        const errorHTML = `<p class="error">${errorMessage}</p>`;
        weatherData.innerHTML = errorHTML;
    };

    const handleNetworkError = () => {
        const errorHTML = `<p class="error">Network error. Please check your internet connection and try again.</p>`;
        weatherData.innerHTML = errorHTML;
    };

    const handleGeoLocationError = (error) => {
        switch (error.code) {
            case error.PERMISSION_DENIED:
                alert("Geolocation permission denied. Please enable geolocation in your browser settings.");
                break;
            case error.POSITION_UNAVAILABLE:
                alert("Geolocation information is unavailable.");
                break;
            case error.TIMEOUT:
                alert("Geolocation request timed out.");
                break;
            case error.UNKNOWN_ERROR:
                alert("An unknown error occurred while fetching geolocation data.");
                break;
            default:
                alert("An error occurred while fetching geolocation data.");
        }
    };

    weatherForm.addEventListener("submit", (event) => {
        event.preventDefault();
        const location = locationInput.value.trim();

        if (location === "") {
            alert("Please enter a location.");
            return;
        }

        const selectedUnit = unitSelector.value;
        fetchWeatherData(location, selectedUnit);
    });

    unitSelector.addEventListener("change", () => {
        const location = locationInput.value.trim();

        if (location === "") {
            alert("Please enter a location.");
            return;
        }

        const selectedUnit = unitSelector.value;
        fetchWeatherData(location, selectedUnit);
    });

    searchButton.addEventListener("click", () => {
        const location = locationInput.value.trim();

        if (location === "") {
            alert("Please enter a location.");
            return;
        }

        const selectedUnit = unitSelector.value;
        fetchWeatherData(location, selectedUnit);
    });

    geoLocationButton.addEventListener("click", () => {
        if ("geolocation" in navigator) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const latitude = position.coords.latitude;
                    const longitude = position.coords.longitude;
                    const selectedUnit = unitSelector.value;
                    fetchWeatherDataByGeolocation(latitude, longitude, selectedUnit);
                },
                (error) => {
                    handleGeoLocationError(error);
                }
            );
        } else {
            alert("Geolocation is not supported in your browser.");
        }
    });

    async function fetchWeatherData(location, unit) {
        try {
            const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${location}&appid=${apiKey}&units=${unit}`);
            const data = await response.json();

            if (response.ok) {
                displayWeatherData(data, unit);
            } else {
                handleWeatherError(data);
            }
        } catch (error) {
            handleNetworkError();
        }
    }

    async function fetchWeatherDataByGeolocation(latitude, longitude, unit) {
        try {
            const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${apiKey}&units=${unit}`);
            const data = await response.json();

            if (response.ok) {
                displayWeatherData(data, unit);
            } else {
                handleWeatherError(data);
            }
        } catch (error) {
            handleNetworkError();
        }
    }
});
