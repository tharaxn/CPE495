document.addEventListener("DOMContentLoaded", function () {
    let weatherData = null;

    const weekTab = document.getElementById("week-tab");
    const todayTab = document.getElementById("today-tab");
    const forecastContainer = document.getElementById("forecast-container");

    function getPollutionStatusColor(pm25) {
        if (pm25 <= 25) return "#75c095";   // เขียว
        if (pm25 <= 50) return "#ffdd63";   // เหลือง
        return "#ff2d2b";                   // แดง
    }

    function updateMainInfo() {
        document.getElementById("temperature").textContent = `${weatherData.temperature}°`;
        document.getElementById("humidity").textContent = weatherData.humidity;
        document.getElementById("windSpeed").textContent = weatherData.windSpeed;
    }

    function renderForecast(dayIndex = null) {
        if (!weatherData || !weatherData.forecast) return;

        forecastContainer.innerHTML = "";

        if (dayIndex !== null) {
            const day = weatherData.forecast[dayIndex % 7];
            const div = document.createElement("div");
            div.classList.add("forecast-card");
            const statusColor = getPollutionStatusColor(day.highlights["PM2.5"]);
            div.innerHTML = `<p>${day.day}</p><div style="font-size: 40px;">${day.status}</div><p>${day.temp}°</p>
                             <div class="pollution-status" style="background-color: ${statusColor}; width: 10px; height: 10px; border-radius: 50%;"></div>`;
            forecastContainer.appendChild(div);
            updateHighlights(day.highlights);
        } else {
            weatherData.forecast.forEach((day, index) => {
                const div = document.createElement("div");
                div.classList.add("forecast-card");
                const statusColor = getPollutionStatusColor(day.highlights["PM2.5"]);
                div.innerHTML = `<p>${day.day}</p><div style="font-size: 30px;">${day.status}</div><p>${day.temp}°</p>
                                 <div class="pollution-status" style="background-color: ${statusColor}; width: 10px; height: 10px; border-radius: 50%;"></div>`;
                
                div.addEventListener("click", function () {
                    updateHighlights(weatherData.forecast[index].highlights);
                });
                
                forecastContainer.appendChild(div);
            });
            updateHighlights(weatherData.forecast[2].highlights);
        }
    }

    function updateHighlights(highlights) {
        const highlightsContainer = document.getElementById("highlights-container");
        highlightsContainer.innerHTML = "";

        Object.entries(highlights).forEach(([key, value]) => {
            const div = document.createElement("div");
            div.classList.add("highlight-card");
            div.innerHTML = `<p>${key}</p><h4>${value} µg/m³</h4>`;
            highlightsContainer.appendChild(div);
        });
    }

    function updateTime() {
        const now = new Date();
        const weekday = now.toLocaleString("en-GB", { weekday: "long" });
        const time = now.toLocaleString("en-GB", { hour: "2-digit", minute: "2-digit" });
        document.getElementById("time").textContent = `${weekday}, ${time}`;
    }

    setInterval(updateTime, 1000);
    updateTime();

    weekTab.addEventListener("click", function () {
        if (!weatherData) return;
        weekTab.classList.add("active");
        todayTab.classList.remove("active");
        renderForecast();
    });

    todayTab.addEventListener("click", function () {
        if (!weatherData) return;
        todayTab.classList.add("active");
        weekTab.classList.remove("active");
        renderForecast(new Date().getDay());
    });

    socket.onmessage = function (event) {
        weatherData = JSON.parse(event.data);
        updateMainInfo();
        renderForecast();
    };
});
