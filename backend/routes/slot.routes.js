const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const { Slot, Product, Log } = require("../models");

// 파일 저장 설정
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/"); // 파일이 저장될 폴더
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  },
});

const upload = multer({ storage: storage });

// -------------------------
// 슬롯 데이터 조회
// -------------------------
router.get("/", async (req, res) => {
  try {
    const slots = await Slot.findAll({ order: [["slotNumber", "ASC"]] });
    res.status(200).json(slots);
  } catch (err) {
    console.error("슬롯 데이터 조회 실패:", err);
    res.status(500).json({ message: "슬롯 데이터 조회 실패" });
  }
});

// -------------------------
// 특정 슬롯 점유
// -------------------------
router.post("/:slotNumber/occupy", async (req, res) => {
  const slotNumber = req.params.slotNumber;

  try {
    const slotUpdateResult = await Slot.update(
      { isOccupied: true },
      { where: { slotNumber } }
    );

    if (slotUpdateResult[0] === 0) {
      console.error(
        `슬롯 ${slotNumber} 업데이트 실패: 슬롯을 찾을 수 없습니다.`
      );
      return res.status(404).json({ message: "슬롯을 찾을 수 없습니다." });
    } else {
      console.log(`슬롯 ${slotNumber} 점유 상태 업데이트 성공.`);
      res
        .status(200)
        .json({ message: `슬롯 ${slotNumber} 점유 상태 업데이트 성공.` });
    }
  } catch (err) {
    console.error("슬롯 업데이트 중 오류 발생:", err);
    res.status(500).json({ message: "슬롯 점유 상태 업데이트 실패" });
  }
});

// -------------------------
// 특정 슬롯 비우기 (출고 로직)
// -------------------------
router.post("/:slotNumber/release", async (req, res) => {
  const slotNumber = req.params.slotNumber;

  try {
    const slot = await Slot.findOne({ where: { slotNumber } });
    if (!slot) {
      return res
        .status(404)
        .json({ message: `슬롯 ${slotNumber}을(를) 찾을 수 없습니다.` });
    }

    if (!slot.isOccupied) {
      return res
        .status(400)
        .json({ message: "해당 슬롯은 이미 비어 있습니다." });
    }

    const product = await Product.findOne({ where: { slotId: slot.id } });
    if (!product) {
      return res.status(404).json({ message: "해당 슬롯에 제품이 없습니다." });
    }

    await Log.create({
      productName: product.productName,
      action: "출고",
      details: `Slot ${slotNumber}: ${product.productName} 출고됨`,
    });

    await slot.update({ isOccupied: false });
    await product.destroy();

    console.log(`Slot ${slotNumber}의 제품이 출고되었습니다.`);
    res
      .status(200)
      .json({ message: `Slot ${slotNumber}의 제품이 출고되었습니다.` });
  } catch (error) {
    console.error("출고 중 오류 발생:", error);
    res.status(500).json({ message: "출고 중 오류가 발생했습니다." });
  }
});

// -------------------------
// 특정 슬롯에 제품 입고 처리 (파일 업로드 포함)
// -------------------------
router.post("/:slotNumber/inbound", upload.single("file"), async (req, res) => {
  const { slotNumber } = req.params;
  const { productName } = req.body;
  const filePath = req.file ? `/uploads/${req.file.filename}` : "";

  console.log("입고 요청:", { slotNumber, productName, filePath });

  try {
    const slot = await Slot.findOne({ where: { slotNumber } });
    if (!slot) {
      console.error(`슬롯 ${slotNumber}을 찾을 수 없습니다.`);
      return res
        .status(404)
        .json({ message: `슬롯 ${slotNumber}을 찾을 수 없습니다.` });
    }

    // 이미 점유된 슬롯의 기존 제품을 덮어쓰기
    if (slot.isOccupied) {
      console.warn(
        `슬롯 ${slotNumber}은 이미 점유된 상태입니다. 기존 제품을 덮어씁니다.`
      );
      const existingProduct = await Product.findOne({
        where: { slotId: slot.id },
      });
      if (existingProduct) {
        await existingProduct.destroy(); // 기존 제품 삭제
      }
    }

    if (!productName || typeof productName !== "string") {
      console.error("입고 요청에 productName이 없거나 유효하지 않습니다.");
      return res
        .status(400)
        .json({ message: "유효한 productName이 필요합니다." });
    }

    const newProduct = await Product.create({
      productName,
      filePath, // 업로드된 파일 경로 저장
      slotId: slot.id,
    });

    await slot.update({ isOccupied: true });

    await Log.create({
      productName,
      action: "입고",
      details: `Slot ${slotNumber}: ${productName} 입고됨`,
    });

    console.log(`Slot ${slotNumber}에 ${productName} 입고 성공.`);
    res.status(201).json({
      message: `Slot ${slotNumber}에 ${productName}이(가) 입고되었습니다.`,
      product: newProduct,
    });
  } catch (error) {
    console.error("입고 처리 중 오류 발생:", error);
    res.status(500).json({ message: "입고 처리 중 서버 오류가 발생했습니다." });
  }
});

// -------------------------
// 슬롯 및 제품 상태 조회
// -------------------------
router.get("/status", async (req, res) => {
  try {
    const slotStatus = await Slot.findAll({
      include: [
        {
          model: Product,
          attributes: ["productName", "filePath"],
        },
      ],
      order: [["slotNumber", "ASC"]],
    });

    const formattedStatus = slotStatus.map((slot) => ({
      slotNumber: slot.slotNumber,
      isOccupied: slot.isOccupied,
      productName: slot.Product ? slot.Product.productName : null,
      productFilePath: slot.Product ? slot.Product.filePath : null,
    }));

    res.status(200).json(formattedStatus);
  } catch (err) {
    console.error("슬롯 상태 조회 실패:", err);
    res.status(500).json({ message: "서버 오류" });
  }
});

module.exports = router;
