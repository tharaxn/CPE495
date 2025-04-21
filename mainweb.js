document.addEventListener("DOMContentLoaded", function () {
    let weatherData = null;

    const weekTab = document.getElementById("week-tab");
    const todayTab = document.getElementById("today-tab");
    const forecastContainer = document.getElementById("forecast-container");

    // ฟังก์ชันเพื่อแปลงสถานะเป็นอิโมจิ
    function getWeatherStatusEmoji(status) {
        switch (status.toLowerCase()) {
            case 'clear':
                return '☀️'; // Sunny
            case 'cloudy':
                return '☁️'; // Cloudy
            case 'rainy':
                return '🌧️'; // Rainy
            case 'stormy':
                return '⛈️'; // Stormy
            case 'snowy':
                return '❄️'; // Snowy
            case 'foggy':
                return '🌫️'; // Foggy
            default:
                return '🌥️'; // Default (partly cloudy)
        }
    }

    // ฟังก์ชันเพื่อแปลง PM2.5 เป็นสีที่แสดงสถานะ
    function getPollutionStatusColor(pm25) {
        if (pm25 <= 25) return "#75c095";   // เขียว
        if (pm25 <= 50) return "#ffdd63";   // เหลือง
        return "#ff2d2b";                   // แดง
    }

    // ฟังก์ชันอัปเดตข้อมูลหลัก
    function updateMainInfo() {
        document.getElementById("temperature").textContent = `${weatherData.temperature}°C`;
        document.getElementById("humidity").textContent = `${weatherData.humidity}`;
        document.getElementById("windSpeed").textContent = `${weatherData.windSpeed}`;
    }

    // ฟังก์ชันแสดงข้อมูลพยากรณ์
    function renderForecast(dayIndex = null) {
        if (!weatherData || !weatherData.forecast) return;

        forecastContainer.innerHTML = "";

        if (dayIndex !== null) {
            const day = weatherData.forecast[dayIndex % 7];
            const div = document.createElement("div");
            div.classList.add("forecast-card");
            const statusEmoji = getWeatherStatusEmoji(day.status);
            const statusColor = getPollutionStatusColor(day.highlights["PM2.5"]);
            div.innerHTML = `<p>${day.day}</p><div style="font-size: 40px;">${statusEmoji}</div><p>${day.temp}°</p>
                             <div class="pollution-status" style="background-color: ${statusColor}; width: 10px; height: 10px; border-radius: 50%;"></div>`;
            forecastContainer.appendChild(div);
            updateHighlights(day.highlights);
        } else {
            weatherData.forecast.forEach((day, index) => {
                const div = document.createElement("div");
                div.classList.add("forecast-card");
                const statusEmoji = getWeatherStatusEmoji(day.status);
                const statusColor = getPollutionStatusColor(day.highlights["PM2.5"]);
                div.innerHTML = `<p>${day.day}</p><div style="font-size: 30px;">${statusEmoji}</div><p>${day.temp}°</p>
                                 <div class="pollution-status" style="background-color: ${statusColor}; width: 10px; height: 10px; border-radius: 50%;"></div>`;

                div.addEventListener("click", function () {
                    updateHighlights(weatherData.forecast[index].highlights);
                });

                forecastContainer.appendChild(div);
            });
            updateHighlights(weatherData.forecast[2].highlights);
        }
    }

    // ฟังก์ชันอัปเดตข้อมูล Highlights
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

    // ฟังก์ชันอัปเดตเวลา
    function updateTime() {
        const now = new Date();
        const weekday = now.toLocaleString("en-GB", { weekday: "long" });
        const time = now.toLocaleString("en-GB", { hour: "2-digit", minute: "2-digit" });
        document.getElementById("time").textContent = `${weekday}, ${time}`;
    }

    setInterval(updateTime, 1000);
    updateTime();

    // เชื่อมต่อกับ WebSocket
    const socket = io("http://localhost:5084");

    // เมื่อได้รับข้อมูลจาก server
    socket.on("weather", function (data) {
        weatherData = data;
        updateMainInfo();
        renderForecast();
    });

    // การควบคุมการเปลี่ยนแท็บ
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
});
