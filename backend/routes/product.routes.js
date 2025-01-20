const express = require("express");
const multer = require("multer");
const db = require("../models");
const { Product, Slot } = db; // Slot 모델 추가
const router = express.Router();

// 파일 업로드 설정
const storage = multer.diskStorage({
  destination: "uploads/",
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({ storage });

// 제품 등록 라우트 - 기본 경로
router.post("/", upload.single("file"), async (req, res) => {
  try {
    console.log("요청 바디:", req.body);
    console.log("업로드된 파일:", req.file);

    const slotNumber = parseInt(req.body.slotNumber, 10); // 문자열을 숫자로 변환
    const productName = req.body.productName;
    const filePath = req.file ? `/uploads/${req.file.filename}` : null;

    if (!slotNumber || isNaN(slotNumber) || !productName || !filePath) {
      return res
        .status(400)
        .json({ message: "모든 필드를 올바르게 입력하세요." });
    }

    // 슬롯에 이미 제품이 존재하는지 확인
    const existingProduct = await Product.findOne({ where: { slotNumber } });
    if (existingProduct) {
      return res
        .status(400)
        .json({ message: "해당 슬롯에 이미 제품이 존재합니다." });
    }

    // 제품 저장
    const product = await Product.create({
      slotNumber,
      productName,
      filePath,
    });

    // 슬롯 점유 상태 업데이트
    const slotUpdateResult = await Slot.update(
      { isOccupied: true }, // 점유 상태 true로 설정
      { where: { slotNumber } }
    );

    if (slotUpdateResult[0] === 0) {
      console.error("슬롯 점유 상태 업데이트 실패: 슬롯을 찾을 수 없습니다.");
    } else {
      console.log(`슬롯 ${slotNumber} 점유 상태 업데이트 성공.`);
    }

    res
      .status(201)
      .json({ message: "제품이 성공적으로 저장되었습니다!", product });
  } catch (err) {
    console.error("제품 저장 중 오류 발생:", err); // 상세 오류 로그 출력
    res.status(500).json({ message: "서버 오류로 저장에 실패했습니다." });
  }
});

// 제품 등록 라우트 - "/api/products" 경로
router.post("/api/products", upload.single("file"), async (req, res) => {
  try {
    console.log("요청 바디:", req.body);
    console.log("업로드된 파일:", req.file);

    const slotNumber = parseInt(req.body.slotNumber, 10); // 문자열을 숫자로 변환
    const productName = req.body.productName;
    const filePath = req.file ? `/uploads/${req.file.filename}` : null;

    if (!slotNumber || isNaN(slotNumber) || !productName || !filePath) {
      return res
        .status(400)
        .json({ message: "모든 필드를 올바르게 입력하세요." });
    }

    // 슬롯에 이미 제품이 존재하는지 확인
    const existingProduct = await Product.findOne({ where: { slotNumber } });
    if (existingProduct) {
      return res
        .status(400)
        .json({ message: "해당 슬롯에 이미 제품이 존재합니다." });
    }

    // 제품 저장
    const product = await Product.create({
      slotNumber,
      productName,
      filePath,
    });

    // 슬롯 점유 상태 업데이트
    const slotUpdateResult = await Slot.update(
      { isOccupied: true }, // 점유 상태 true로 설정
      { where: { slotNumber } }
    );

    if (slotUpdateResult[0] === 0) {
      console.error("슬롯 점유 상태 업데이트 실패: 슬롯을 찾을 수 없습니다.");
    } else {
      console.log(`슬롯 ${slotNumber} 점유 상태 업데이트 성공.`);
    }

    res
      .status(201)
      .json({ message: "제품이 성공적으로 저장되었습니다!", product });
  } catch (err) {
    console.error("제품 저장 중 오류 발생:", err); // 상세 오류 로그 출력
    res.status(500).json({ message: "서버 오류로 저장에 실패했습니다." });
  }
});

// 제품 조회 라우트
router.get("/", async (req, res) => {
  try {
    const products = await Product.findAll({
      order: [["createdAt", "DESC"]],
    });
    res.status(200).json(products);
  } catch (err) {
    res.status(500).json({ message: "서버 오류로 조회 실패" });
  }
});

// 제품 삭제 라우트
router.delete("/:id", async (req, res) => {
  try {
    const productId = req.params.id;

    // 삭제할 제품 조회
    const product = await Product.findByPk(productId);
    if (!product) {
      return res.status(404).json({ message: "제품을 찾을 수 없습니다." });
    }

    // 슬롯 점유 상태 초기화
    await Slot.update(
      { isOccupied: false },
      { where: { slotNumber: product.slotNumber } }
    );

    // 제품 삭제
    await product.destroy();

    res.status(200).json({ message: "제품 삭제 및 슬롯 초기화 완료" });
  } catch (err) {
    console.error("제품 삭제 실패:", err);
    res.status(500).json({ message: "서버 오류" });
  }
});

module.exports = router;
