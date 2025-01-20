const express = require("express");
const router = express.Router();
const db = require("../models");
const Log = db.Log; // 로그 테이블 모델

// 로그 조회
router.get("/", async (req, res) => {
  try {
    const logs = await Log.findAll({ order: [["timestamp", "DESC"]] });
    res.status(200).json(logs);
  } catch (err) {
    console.error("로그 조회 실패:", err);
    res.status(500).json({ message: "로그 조회 실패" });
  }
});

// 로그 생성
router.post("/", async (req, res) => {
  try {
    const { productName, action } = req.body;

    if (!productName || !action) {
      return res
        .status(400)
        .json({ message: "productName과 action이 필요합니다." });
    }

    const newLog = await Log.create({
      productName,
      action,
      timestamp: new Date(),
    });

    res.status(201).json(newLog);
  } catch (err) {
    console.error("로그 생성 실패:", err);
    res.status(500).json({ message: "로그 생성 실패" });
  }
});

module.exports = router;
