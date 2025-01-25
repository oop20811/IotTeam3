const express = require("express");
const cors = require("cors");
const productRoutes = require("./routes/product.routes");
const slotRoutes = require("./routes/slot.routes");
const logRoutes = require("./routes/log.routes");
const fs = require("fs");
const path = require("path");
const { sequelize, Slot, Product, Log } = require("./models");
const mqtt = require("mqtt");

const app = express();

// MQTT 브로커 설정
const brokerUrl = "mqtt://192.168.0.7";
const mqttClient = mqtt.connect(brokerUrl);

mqttClient.on("connect", () => {
  console.log("Connected to MQTT broker");
});

mqttClient.on("error", (err) => {
  console.error("Failed to connect to MQTT broker:", err);
});

// Ensure 'uploads/' directory exists
if (!fs.existsSync("uploads")) {
  fs.mkdirSync("uploads");
}

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static("uploads"));

// 로깅 미들웨어
app.use((req, res, next) => {
  console.log(`[${req.method}] ${req.url} - Body:`, req.body);
  next();
});

// CORS 설정
app.use(
  cors({
    origin: "http://localhost:5173", // 프론트엔드 도메인
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);

// 정적 경로 설정
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Routes
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

    const PORT = process.env.PORT || 8080;
    app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
  } catch (error) {
    console.error("Unable to connect to the database:", error);
  }
};

// MQTT 메시지 발행 함수
const publishMqttMessage = (topic, message) => {
  mqttClient.publish(topic, message, (err) => {
    if (err) {
      console.error(`Failed to publish to ${topic}:`, err);
    } else {
      console.log(`Published to ${topic}: ${message}`);
    }
  });
};

// 입고 처리 및 MQTT 발행
app.post("/api/slots/:slotNumber/inbound", async (req, res) => {
  const { slotNumber } = req.params;
  const { productName } = req.body;

  try {
    const slot = await Slot.findOne({ where: { slotNumber } });
    if (!slot) {
      return res.status(404).json({ message: `Slot ${slotNumber} not found` });
    }

    if (slot.isOccupied) {
      const existingProduct = await Product.findOne({
        where: { slotId: slot.id },
      });
      if (existingProduct) await existingProduct.destroy();
    }

    const newProduct = await Product.create({
      productName,
      filePath: req.body.filePath || "",
      slotId: slot.id,
    });

    await slot.update({ isOccupied: true });

    await Log.create({
      productName,
      action: "입고",
      details: `Slot ${slotNumber}: ${productName} 입고됨`,
    });

    publishMqttMessage(
      `inbound${slotNumber}`,
      `Slot ${slotNumber}: ${productName} 입고됨`
    );

    console.log(`Slot ${slotNumber}에 ${productName} 입고 성공`);
    res
      .status(201)
      .json({ message: "Product inbounded successfully", product: newProduct });
  } catch (err) {
    console.error("Error during inbound:", err);
    res.status(500).json({ error: "Failed to process inbound" });
  }
});

// 출고 처리 및 MQTT 발행
app.post("/api/slots/:slotNumber/release", async (req, res) => {
  const { slotNumber } = req.params;

  try {
    const slot = await Slot.findOne({ where: { slotNumber } });
    if (!slot) {
      return res.status(404).json({ message: `Slot ${slotNumber} not found` });
    }

    if (!slot.isOccupied) {
      return res.status(400).json({ message: "Slot is already empty" });
    }

    const product = await Product.findOne({ where: { slotId: slot.id } });
    if (!product) {
      return res.status(404).json({ message: "No product in the slot" });
    }

    await Log.create({
      productName: product.productName,
      action: "출고",
      details: `Slot ${slotNumber}: ${product.productName} 출고됨`,
    });

    await slot.update({ isOccupied: false });
    await product.destroy();

    publishMqttMessage(`release${slotNumber}`, `Slot ${slotNumber}: 출고됨`);

    console.log(`Slot ${slotNumber}의 제품이 출고되었습니다`);
    res.status(200).json({ message: "Product released successfully" });
  } catch (err) {
    console.error("Error during release:", err);
    res.status(500).json({ error: "Failed to process release" });
  }
});

startServer();
