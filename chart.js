// รอให้ DOM โหลดเสร็จก่อน
document.addEventListener("DOMContentLoaded", function () {
    // ดึง element ของ canvas
    var ctx = document.getElementById("pm25Chart").getContext("2d");

    // สร้าง Chart
    new Chart(ctx, {
        type: "line", // ประเภทของกราฟ (line, bar, pie, etc.)
        data: {
            labels: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"], // ชื่อวัน
            datasets: [{
                label: "PM2.5 Levels",
                data: [90, 85, 100, 95, 80, 70, 75], // ข้อมูลค่าฝุ่น PM2.5 รายวัน
                borderColor: "red", // สีเส้นกราฟ
                backgroundColor: "rgba(255, 99, 132, 0.2)", // สีพื้นหลังเส้นกราฟ
                borderWidth: 2
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });
});
