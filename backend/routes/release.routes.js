const express = require("express");
const router = express.Router();
const db = require("../models");
const Slot = db.Slot;
const Product = db.Product;
const Log = db.Log;

router.post("/slots/:slotNumber/release", async (req, res) => {
  const { slotNumber } = req.params;

  try {
    // 슬롯 데이터 확인
    const slot = await Slot.findOne({ where: { slotNumber } });
    if (!slot) {
      return res.status(404).json({ message: "슬롯을 찾을 수 없습니다." });
    }

    // 슬롯에 연결된 제품 삭제
    const product = await Product.findOne({ where: { slotNumber } });
    if (product) {
      await product.destroy();
    }

    // 슬롯 점유 상태 업데이트
    await Slot.update({ isOccupied: false }, { where: { slotNumber } });

    // 로그 저장
    await Log.create({
      action: "출고",
      details: `Slot ${slotNumber}: ${
        product ? product.productName : "알 수 없음"
      } 출고됨`,
    });

    res
      .status(200)
      .json({ message: `Slot ${slotNumber}의 제품이 출고되었습니다.` });
  } catch (error) {
    console.error("출고 중 오류:", error);
    res.status(500).json({ message: "출고 중 서버 오류가 발생했습니다." });
  }
});

module.exports = router;
