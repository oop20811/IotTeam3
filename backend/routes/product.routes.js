const express = require("express");
const multer = require("multer");
const db = require("../models");
const { Product, Slot } = db; // Slot 모델 사용
const router = express.Router();

// 파일 업로드 설정
const storage = multer.diskStorage({
  destination: "uploads/",
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({ storage });

// -------------------------
// [1] 제품 등록 (POST "/")
// -------------------------
router.post("/", upload.single("file"), async (req, res) => {
  try {
    console.log("요청 바디:", req.body);
    console.log("업로드된 파일:", req.file);

    const slotNumber = parseInt(req.body.slotNumber, 10); // 문자열 -> 숫자로 변환
    const productName = req.body.productName;
    const filePath = req.file ? `/uploads/${req.file.filename}` : null;

    // 기본 유효성 검사
    if (!slotNumber || isNaN(slotNumber) || !productName || !filePath) {
      return res
        .status(400)
        .json({ message: "모든 필드를 올바르게 입력하세요." });
    }

    // 1) slots 테이블에서 slotNumber로 슬롯 찾기
    const slot = await Slot.findOne({ where: { slotNumber } });
    if (!slot) {
      return res
        .status(404)
        .json({ message: `슬롯 번호 ${slotNumber}가 존재하지 않습니다.` });
    }

    // 2) 해당 슬롯에 이미 제품이 있는지 확인 (slotId로 Product 조회)
    const existingProduct = await Product.findOne({
      where: { slotId: slot.id },
    });
    if (existingProduct) {
      return res
        .status(400)
        .json({ message: "해당 슬롯에 이미 제품이 존재합니다." });
    }

    // 3) 새로운 제품 생성: products 테이블에는 slotId만 저장
    const product = await Product.create({
      productName,
      filePath,
      slotId: slot.id, // FK 설정
    });

    // 4) 슬롯 점유 상태 업데이트 (isOccupied = true)
    const slotUpdateResult = await Slot.update(
      { isOccupied: true }, // 점유 상태 true로 변경
      { where: { id: slot.id } } // slotNumber 대신 PK(id) 사용
    );

    if (slotUpdateResult[0] === 0) {
      console.error("슬롯 점유 상태 업데이트 실패: 슬롯을 찾을 수 없습니다.");
    } else {
      console.log(
        `슬롯 ${slotNumber}(ID: ${slot.id}) 점유 상태 업데이트 성공.`
      );
    }

    res.status(201).json({
      message: "제품이 성공적으로 저장되었습니다!",
      product,
    });
  } catch (err) {
    console.error("제품 저장 중 오류 발생:", err);
    res.status(500).json({ message: "서버 오류로 저장에 실패했습니다." });
  }
});

// -------------------------
// [2] 제품 등록 (POST "/api/products")
// -------------------------
router.post("/api/products", upload.single("file"), async (req, res) => {
  try {
    console.log("요청 바디:", req.body);
    console.log("업로드된 파일:", req.file);

    const slotNumber = parseInt(req.body.slotNumber, 10);
    const productName = req.body.productName;
    const filePath = req.file ? `/uploads/${req.file.filename}` : null;

    if (!slotNumber || isNaN(slotNumber) || !productName || !filePath) {
      return res
        .status(400)
        .json({ message: "모든 필드를 올바르게 입력하세요." });
    }

    // 1) 슬롯 찾기
    const slot = await Slot.findOne({ where: { slotNumber } });
    if (!slot) {
      return res
        .status(404)
        .json({ message: `슬롯 번호 ${slotNumber}가 존재하지 않습니다.` });
    }

    // 2) 이미 제품이 있는지 확인
    const existingProduct = await Product.findOne({
      where: { slotId: slot.id },
    });
    if (existingProduct) {
      return res
        .status(400)
        .json({ message: "해당 슬롯에 이미 제품이 존재합니다." });
    }

    // 3) 제품 생성
    const product = await Product.create({
      productName,
      filePath,
      slotId: slot.id,
    });

    // 4) 슬롯 점유 상태 업데이트
    const slotUpdateResult = await Slot.update(
      { isOccupied: true },
      { where: { id: slot.id } }
    );

    if (slotUpdateResult[0] === 0) {
      console.error("슬롯 점유 상태 업데이트 실패: 슬롯을 찾을 수 없습니다.");
    } else {
      console.log(
        `슬롯 ${slotNumber}(ID: ${slot.id}) 점유 상태 업데이트 성공.`
      );
    }

    res.status(201).json({
      message: "제품이 성공적으로 저장되었습니다!",
      product,
    });
  } catch (err) {
    console.error("제품 저장 중 오류 발생:", err);
    res.status(500).json({ message: "서버 오류로 저장에 실패했습니다." });
  }
});

// -------------------------
// [3] 제품 조회 (GET "/")
// -------------------------
router.get("/", async (req, res) => {
  try {
    const products = await Product.findAll({
      order: [["createdAt", "DESC"]],
      // 만약 슬롯 번호까지 같이 보고 싶다면 Slot을 조인(include)할 수 있음:
      // include: [Slot],
    });
    res.status(200).json(products);
  } catch (err) {
    res.status(500).json({ message: "서버 오류로 조회 실패" });
  }
});

// -------------------------
// [4] 제품 삭제 (DELETE "/:id")
// -------------------------
router.delete("/:id", async (req, res) => {
  try {
    const productId = req.params.id;

    // 1) 삭제할 제품 조회
    const product = await Product.findByPk(productId);
    if (!product) {
      return res.status(404).json({ message: "제품을 찾을 수 없습니다." });
    }

    // 2) 해당 제품의 slotId를 통해 슬롯 찾기
    const slotId = product.slotId;
    // 원한다면 Slot.findByPk(slotId)를 해볼 수도 있지만, 단순 업데이트만 할 거라면 바로 update

    // 3) 슬롯 점유 상태 해제
    await Slot.update(
      { isOccupied: false },
      { where: { id: slotId } } // slotNumber 대신 id 로 매칭
    );

    // 4) 제품 삭제
    await product.destroy();

    res.status(200).json({ message: "제품 삭제 및 슬롯 초기화 완료" });
  } catch (err) {
    console.error("제품 삭제 실패:", err);
    res.status(500).json({ message: "서버 오류" });
  }
});

module.exports = router;
