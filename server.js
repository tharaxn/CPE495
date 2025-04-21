const socket = new WebSocket("ws://localhost:5084/"); 

socket.onmessage = function (event) {
    const data = JSON.parse(event.data);

    // อัปเดตอุณหภูมิ, ความชื้น, ความเร็วลม
    document.getElementById('temperature').innerText = `${data.TempC}°`;
    document.getElementById('humidity').innerText = data.Hum;
    document.getElementById('windSpeed').innerText = data.Windspeed;
    
    document.getElementById('pm25').innerText = `${data.pm2_5} µg/m³`;
    document.getElementById('pm10').innerText = `${data.pm10} µg/m³`;
    document.getElementById('ozone').innerText = `${data.o3} µg/m³`;
    document.getElementById('co2').innerText = `${data.co} µg/m³`;
    document.getElementById('no2').innerText = `${data.no2} µg/m³`;
    document.getElementById('so2').innerText = `${data.so2} µg/m³`;

};

socket.onerror = function (error) {
    console.error("WebSocket Error:", error);
};