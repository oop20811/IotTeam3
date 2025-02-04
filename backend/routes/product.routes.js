// routes/product.routes.js
const express = require("express");
const router = express.Router();
const { Product, Slot, Log } = require("../models");
const { publishMqttMessage } = require("../mqttClient"); // MQTT 발행 함수 불러오기

// -------------------------
// 모든 제품 조회
// -------------------------
router.get("/", async (req, res) => {
  try {
    const products = await Product.findAll({
      include: Slot,
      order: [["id", "ASC"]],
    });
    res.status(200).json(products);
  } catch (err) {
    console.error("제품 조회 실패:", err);
    res.status(500).json({ message: "제품 조회 실패" });
  }
});

// -------------------------
// 특정 제품 조회
// -------------------------
router.get("/:id", async (req, res) => {
  const productId = req.params.id;
  try {
    const product = await Product.findOne({
      where: { id: productId },
      include: Slot,
    });
    if (!product) {
      return res.status(404).json({ message: "제품을 찾을 수 없습니다." });
    }
    res.status(200).json(product);
  } catch (err) {
    console.error("특정 제품 조회 실패:", err);
    res.status(500).json({ message: "특정 제품 조회 실패" });
  }
});

// -------------------------
// 제품 생성 (입고와 유사)
// -------------------------
router.post("/", async (req, res) => {
  const { productName, filePath, slotId } = req.body;
  try {
    const slot = await Slot.findOne({ where: { id: slotId } });
    if (!slot) {
      return res.status(404).json({ message: "슬롯을 찾을 수 없습니다." });
    }

    if (slot.isOccupied) {
      return res.status(400).json({ message: "슬롯이 이미 점유되었습니다." });
    }

    const newProduct = await Product.create({
      productName,
      filePath,
      slotId,
    });

    await slot.update({ isOccupied: true });

    // 로그 생성
    const newLog = await Log.create({
      productName,
      action: "입고",
      slotNumber: slot.slotNumber,
      timestamp: new Date(),
      details: `Slot ${slot.slotNumber}: ${productName} 입고됨`,
    });

    // MQTT 메시지 발행
    const topic = `inbound/${slot.slotNumber}`;
    const message = `inbound${slot.slotNumber}`;
    publishMqttMessage(topic, message);

    res.status(201).json({
      message: `${productName}이(가) 슬롯 ${slot.slotNumber}에 입고되었습니다.`,
      product: newProduct,
    });
  } catch (error) {
    console.error("제품 생성 실패:", error);
    res.status(500).json({ message: "제품 생성 실패" });
  }
});

// -------------------------
// 제품 업데이트
// -------------------------
router.put("/:id", async (req, res) => {
  const productId = req.params.id;
  const { productName, filePath, slotId } = req.body;

  try {
    const product = await Product.findOne({ where: { id: productId } });
    if (!product) {
      return res.status(404).json({ message: "제품을 찾을 수 없습니다." });
    }

    // 슬롯 변경 시 기존 슬롯의 점유 상태 업데이트
    if (slotId && slotId !== product.slotId) {
      const newSlot = await Slot.findOne({ where: { id: slotId } });
      if (!newSlot) {
        return res.status(404).json({ message: "새 슬롯을 찾을 수 없습니다." });
      }

      if (newSlot.isOccupied) {
        return res
          .status(400)
          .json({ message: "새 슬롯이 이미 점유되었습니다." });
      }

      // 기존 슬롯의 점유 상태 업데이트
      const oldSlot = await Slot.findOne({ where: { id: product.slotId } });
      await oldSlot.update({ isOccupied: false });

      // 새 슬롯의 점유 상태 업데이트
      await newSlot.update({ isOccupied: true });

      product.slotId = slotId;
    }

    if (productName) product.productName = productName;
    if (filePath) product.filePath = filePath;

    await product.save();

    res.status(200).json({ message: "제품이 업데이트되었습니다.", product });
  } catch (err) {
    console.error("제품 업데이트 실패:", err);
    res.status(500).json({ message: "제품 업데이트 실패" });
  }
});

// -------------------------
// 제품 삭제 (출고와 유사)
// -------------------------
router.delete("/:id", async (req, res) => {
  const productId = req.params.id;
  try {
    const product = await Product.findOne({
      where: { id: productId },
      include: Slot,
    });
    if (!product) {
      return res.status(404).json({ message: "제품을 찾을 수 없습니다." });
    }

    const slot = product.Slot;
    if (slot) {
      await slot.update({ isOccupied: false });
    }

    await product.destroy();

    // 로그 생성
    const newLog = await Log.create({
      productName: product.productName,
      action: "출고",
      slotNumber: slot.slotNumber,
      timestamp: new Date(),
      details: `제품 ${product.productName}이 슬롯 ${slot.slotNumber}에서 출고되었습니다.`,
    });

    // MQTT 메시지 발행
    const topic = `release/${slot.slotNumber}`;
    const message = `release${slot.slotNumber}`;
    publishMqttMessage(topic, message);

    res.status(200).json({ message: "제품이 삭제되었습니다." });
  } catch (err) {
    console.error("제품 삭제 실패:", err);
    res.status(500).json({ message: "제품 삭제 실패" });
  }
});

module.exports = router;
