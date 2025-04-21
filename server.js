const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');

const app = express();
app.use(cors());
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: "*",
    }
});

const PORT = 5084;

io.on('connection', (socket) => {
    console.log('Client connected:', socket.id);

    // ส่งข้อมูลจำลองทุก 5 วินาที
    setInterval(() => {
        const weatherData = {
            temperature: Math.floor(Math.random() * 35) + 20,
            humidity: Math.floor(Math.random() * 50) + 40,
            windSpeed: (Math.random() * 5).toFixed(2),
            forecast: Array.from({ length: 7 }).map((_, i) => ({
                day: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][i],
                status: ['Sunny', 'Rainy', 'Cloudy'][Math.floor(Math.random() * 3)],
                temp: Math.floor(Math.random() * 10) + 25,
                highlights: {
                    "PM2.5": Math.floor(Math.random() * 80),
                    "PM10": Math.floor(Math.random() * 100),
                    "CO": (Math.random() * 2).toFixed(2),
                    "NO2": (Math.random() * 50).toFixed(2)
                }
            }))
        };

        socket.emit('weather', weatherData);
    }, 5000);
});

server.listen(PORT, () => {
    console.log(`✅ Server running at http://localhost:${PORT}`);
});
