const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const mongoose = require('mongoose');

const app = express();
app.use(cors());

const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: "*",
    }
});

const PORT = 5084;

// ✅ 1. เชื่อมต่อ MongoDB ที่พอร์ต 27017 (พอร์ตปกติของ MongoDB)
mongoose.connect('mongodb://localhost:27017/weatherDB')
    .then(() => console.log('✅ Connected to MongoDB'))
    .catch((err) => console.error('❌ MongoDB connection error:', err));

// ✅ 2. สร้างโมเดลข้อมูล
const WeatherSchema = new mongoose.Schema({
    TempC: Number,
    Hum: Number,
    windSpeed: Number,
    pm2_5: Number,
    pm10: Number,
    co: Number,
    no2: Number,
    so2: Number,
    o3: Number,
    date: { type: Date, default: Date.now },
});

const Weather = mongoose.model('Weather', WeatherSchema);

// ✅ 3. ส่งข้อมูลล่าสุดให้ client ทุก 5 วิ
io.on('connection', (socket) => {
    console.log('Client connected:', socket.id);

    const interval = setInterval(async () => {
        try {
            const latest = await Weather.findOne().sort({ date: -1 });

            if (latest) {
                const weatherData = {
                    TempC: latest.TempC,
                    Hum: latest.Hum,
                    windSpeed: latest.windSpeed,
                    pm2_5: latest.pm2_5,
                    pm10: latest.pm10,
                    co: latest.co,
                    no2: latest.no2,
                    so2: latest.so2,
                    o3: latest.o3,
                };

                socket.emit('weather', weatherData);
            }
        } catch (error) {
            console.error('❌ Error fetching weather data:', error);
        }
    }, 5000); // เปลี่ยนเป็น 5000ms หรือ 5 วินาทีแทนการตั้งเป็น 5084 โดยบังเอิญ

    socket.on('disconnect', () => {
        console.log('Client disconnected:', socket.id);
        clearInterval(interval);
    });
});

server.listen(PORT, () => {
    console.log(`✅ Server running at http://localhost:${PORT}`);
});
