const apiKey = "78079d22110d8b50be0b700119ec2d43";
const apiUrl = "https://api.openweathermap.org/data/2.5/weather?units=metric&q=";
const apiCoords = "https://api.openweathermap.org/data/2.5/weather?units=metric&lat=";

const searchBox = document.querySelector(".search input");
const searchBtn = document.querySelector(".search-btn");
const locationBtn = document.querySelector(".location-btn");
const weatherIcon = document.querySelector(".weather-icon");

// Background gradients for different weather conditions
const weatherBackgrounds = {
    Clear: "linear-gradient(135deg, #56CCF2, #2F80ED)",      // Sunny Blue
    Clouds: "linear-gradient(135deg, #bdc3c7, #2c3e50)",     // Cloudy Gray
    Rain: "linear-gradient(135deg, #4b6cb7, #182848)",       // Rainy Dark
    Drizzle: "linear-gradient(135deg, #647d8e, #283048)",    // Light Rain
    Mist: "linear-gradient(135deg, #606c88, #3f4c6b)",       // Foggy
    Snow: "linear-gradient(135deg, #E0EAFC, #CFDEF3)",       // Snowy White
    Thunderstorm: "linear-gradient(135deg, #232526, #414345)", // Storm Dark
    default: "linear-gradient(135deg, #00feba, #5b548a)"     // Original Default
};

// Update UI with weather data
function updateWeatherUI(data) {
    document.querySelector(".city").innerHTML = data.name;
    document.querySelector(".temp").innerHTML = Math.round(data.main.temp) + "°c";
    document.querySelector(".humidity").innerHTML = data.main.humidity + "%";
    document.querySelector(".wind").innerHTML = data.wind.speed + " km/h";

    const weatherMain = data.weather[0].main;

    // Update Icon
    const iconMap = {
        Clouds: "https://cdn-icons-png.flaticon.com/512/1163/1163624.png",
        Clear: "https://cdn-icons-png.flaticon.com/512/6974/6974833.png",
        Rain: "https://cdn-icons-png.flaticon.com/512/1163/1163657.png",
        Drizzle: "https://cdn-icons-png.flaticon.com/512/3076/3076129.png",
        Mist: "https://cdn-icons-png.flaticon.com/512/4005/4005901.png",
        Snow: "https://cdn-icons-png.flaticon.com/512/2315/2315309.png",
        Thunderstorm: "https://cdn-icons-png.flaticon.com/512/1146/1146869.png"
    };
    weatherIcon.src = iconMap[weatherMain] || iconMap.Clear;

    // Update Background
    document.body.style.background = weatherBackgrounds[weatherMain] || weatherBackgrounds.default;

    // Show weather, hide error
    document.querySelector(".weather").style.display = "block";
    document.querySelector(".error").style.display = "none";
}

// Fetch weather by city name
async function checkWeather(city) {
    try {
        const response = await fetch(apiUrl + city + `&appid=${apiKey}`);
        if (response.status == 404) {
            document.querySelector(".error").style.display = "block";
            document.querySelector(".weather").style.display = "none";
        } else {
            const data = await response.json();
            updateWeatherUI(data);
        }
    } catch (error) {
        console.error("Error fetching weather:", error);
        alert("Failed to fetch weather data. Check your connection or API key.");
    }
}

// Fetch weather by coordinates (Location)
async function checkWeatherByLocation(lat, lon) {
    try {
        const response = await fetch(`${apiCoords}${lat}&lon=${lon}&appid=${apiKey}`);
        const data = await response.json();
        updateWeatherUI(data);
    } catch (error) {
        console.error("Error fetching location weather:", error);
        alert("Failed to get weather for your location.");
    }
}

// Get user's current location
function getUserLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                const lat = position.coords.latitude;
                const lon = position.coords.longitude;
                checkWeatherByLocation(lat, lon);
            },
            (error) => {
                console.error("Geolocation error:", error);
                alert("Unable to retrieve your location. Please enable location access.");
            }
        );
    } else {
        alert("Geolocation is not supported by this browser.");
    }
}

// Event Listeners
searchBtn.addEventListener("click", () => {
    checkWeather(searchBox.value);
});

locationBtn.addEventListener("click", () => {
    getUserLocation();
});

searchBox.addEventListener("keypress", (e) => {
    if (e.key === 'Enter') {
        checkWeather(searchBox.value);
    }
});

// Optional: Load default city on page load
// checkWeather("Accra");