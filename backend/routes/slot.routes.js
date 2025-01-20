const express = require("express");
const router = express.Router();
const { Slot, Product, Log } = require("../models"); // 모델 추가

// 슬롯 데이터 조회
router.get("/", async (req, res) => {
  try {
    const slots = await Slot.findAll({ order: [["slotNumber", "ASC"]] });
    res.status(200).json(slots);
  } catch (err) {
    console.error("슬롯 데이터 조회 실패:", err);
    res.status(500).json({ message: "슬롯 데이터 조회 실패" });
  }
});

// 특정 슬롯 점유
router.post("/:slotNumber/occupy", async (req, res) => {
  const slotNumber = req.params.slotNumber;

  try {
    const slotUpdateResult = await Slot.update(
      { isOccupied: true }, // 점유 상태를 true로 설정
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

// 특정 슬롯 비우기 (출고 로직)
router.post("/:slotNumber/release", async (req, res) => {
  const slotNumber = req.params.slotNumber;

  try {
    // 슬롯과 관련된 제품 찾기
    const slot = await Slot.findOne({ where: { slotNumber } });
    if (!slot || !slot.isOccupied) {
      return res.status(404).json({ message: "해당 슬롯은 비어 있습니다." });
    }

    const product = await Product.findOne({ where: { slotNumber } });
    if (!product) {
      return res.status(404).json({ message: "해당 슬롯에 제품이 없습니다." });
    }

    // 로그 추가
    await Log.create({
      productName: product.productName,
      action: "출고",
      details: `Slot ${slotNumber}: ${product.productName} 출고됨`,
    });

    // 슬롯 비우기
    await slot.update({ isOccupied: false });
    await product.destroy(); // 제품 삭제

    res
      .status(200)
      .json({ message: `Slot ${slotNumber}의 제품이 출고되었습니다.` });
  } catch (error) {
    console.error("출고 중 오류 발생:", error);
    res.status(500).json({ message: "출고 중 오류가 발생했습니다." });
  }
});

// 슬롯 및 제품 상태 조회
router.get("/status", async (req, res) => {
  try {
    const slotStatus = await Slot.findAll({
      include: [
        {
          model: Product,
          attributes: ["productName", "filePath"], // 제품 이름 및 파일 경로만 포함
        },
      ],
      order: [["slotNumber", "ASC"]], // 슬롯 번호로 정렬
    });

    const formattedStatus = slotStatus.map((slot) => ({
      slotNumber: slot.slotNumber,
      isOccupied: slot.isOccupied,
      productName: slot.Product ? slot.Product.productName : null,
      productFilePath: slot.Product ? slot.Product.filePath : null,
    }));

    res.status(200).json(formattedStatus); // 상태 반환
  } catch (err) {
    console.error("슬롯 상태 조회 실패:", err);
    res.status(500).json({ message: "서버 오류" });
  }
});

module.exports = router;
