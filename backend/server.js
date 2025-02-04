// server.js
const express = require("express");
const cors = require("cors");
const productRoutes = require("./routes/product.routes"); // 수정된 경로
const slotRoutes = require("./routes/slot.routes"); // 수정된 경로
const logRoutes = require("./routes/log.routes"); // 수정된 경로
const fs = require("fs");
const path = require("path");
const { sequelize } = require("./models"); // models/index.js에서 sequelize 불러오기
const { mqttClient } = require("./mqttClient"); // MQTT 클라이언트 불러오기

const app = express();

// 'uploads/' 디렉토리가 존재하는지 확인하고 없으면 생성
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

// CORS 세부 설정 (필요 시 중복 제거)
app.use(
  cors({
    origin: "http://localhost:5173", // 프론트엔드 도메인
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
