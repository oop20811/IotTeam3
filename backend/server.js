// server.js
const express = require("express");
const cors = require("cors");
const productRoutes = require("./routes/product.routes");
const slotRoutes = require("./routes/slot.routes");
const logRoutes = require("./routes/log.routes");
const fs = require("fs");
const path = require("path");
const { sequelize } = require("./models");
const { mqttClient } = require("./mqttClient");

// server.js가 실행될 때 sshExecutor.js도 함께 실행됩니다.
require("./sshExecutor.js");

const app = express();

// 'uploads/' 디렉토리 생성 확인
if (!fs.existsSync("uploads")) {
  fs.mkdirSync("uploads");
}

// 미들웨어 설정
app.use(cors());
app.use(express.json());
app.use(express.static("uploads"));

// 로깅 미들웨어
app.use((req, res, next) => {
  console.log(`[${req.method}] ${req.url} - Body:`, req.body);
  next();
});

// CORS 세부 설정
app.use(
  cors({
    origin: "http://localhost:5173",
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);

// 정적 파일 경로 설정
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// 라우트 설정
app.use("/api/products", productRoutes);
app.use("/api/slots", slotRoutes);
app.use("/api/logs", logRoutes);

// 기본 경로
app.get("/", (req, res) => {
  res.send("Welcome to the API server!");
});

// 서버 실행 함수
const startServer = async () => {
  try {
    console.log("Connecting to the database...");
    await sequelize.authenticate();
    console.log("Database connected successfully!");

    // MQTT 브로커 연결 확인
    mqttClient.on("connect", () => {
      console.log("Connected to MQTT broker");
    });

    const PORT = process.env.PORT || 8080;
    app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
  } catch (error) {
    console.error("Unable to connect to the database:", error);
  }
};

startServer();
