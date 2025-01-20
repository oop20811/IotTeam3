const express = require("express");
const cors = require("cors");
const productRoutes = require("./routes/product.routes");
const slotRoutes = require("./routes/slot.routes");
const releaseRoutes = require("./routes/release.routes");
const logRoutes = require("./routes/log.routes");
const fs = require("fs");
const app = express();
const db = require("./models"); // models/index.js에서 내보낸 db 객체
const path = require("path");

// 쓰기 권한 확인
fs.access(".", fs.constants.W_OK, (err) => {
  if (err) {
    console.error("No write permission in the current directory:", err);
  } else {
    console.log("Write permission is available.");
  }
});

// Ensure 'uploads/' directory exists
if (!fs.existsSync("uploads")) {
  fs.mkdirSync("uploads");
}

app.use(cors());
app.use(express.json());
app.use(express.static("uploads")); // 정적 파일 제공

// 로깅 미들웨어
app.use((req, res, next) => {
  console.log(`[${req.method}] ${req.url} - Body:`, req.body);
  next();
});

app.use(
  cors({
    origin: "http://localhost:5173", // 프론트엔드 도메인
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true, // 쿠키와 인증 정보 허용
  })
);

app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Routes
app.use("/api/products", productRoutes);
app.use("/api/slots", slotRoutes);
app.use("/api", releaseRoutes);
app.use("/api/logs", logRoutes); // 로그 라우터 추가

// 기본 경로
app.get("/", (req, res) => {
  res.send("Welcome to the API server!");
});

// 서버 실행
db.sequelize
  .sync({ alter: true })
  .then(() => {
    // 'alter: true'로 수정
    const PORT = 8080;
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}.`);
    });
  })
  .catch((error) => {
    console.error("데이터베이스 동기화 중 오류 발생:", error);
  });
