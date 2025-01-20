const db = require("../models");
const Slot = db.Slot;

// 모든 슬롯 가져오기
exports.getAllSlots = async (req, res) => {
  try {
    const slots = await Slot.findAll({
      attributes: ["slotNumber", "isOccupied"],
      order: [["slotNumber", "ASC"]],
    });
    res.status(200).json(slots);
  } catch (err) {
    console.error("Failed to fetch slots:", err);
    res.status(500).send({ message: "Failed to fetch slots" });
  }
};

// 특정 슬롯 점유
exports.occupySlot = async (req, res) => {
  try {
    const slotNumber = req.params.slotNumber;
    const slot = await Slot.findOne({ where: { slotNumber } });

    if (!slot) {
      return res.status(404).send({ message: "Slot not found" });
    }

    if (slot.isOccupied) {
      return res.status(400).send({ message: "Slot is already occupied" });
    }

    slot.isOccupied = true;
    await slot.save();
    res
      .status(200)
      .send({ message: `Slot ${slotNumber} occupied successfully` });
  } catch (err) {
    console.error("Failed to occupy slot:", err);
    res.status(500).send({ message: "Failed to occupy slot" });
  }
};

// 특정 슬롯 비우기
exports.releaseSlot = async (req, res) => {
  try {
    const slotNumber = req.params.slotNumber;
    const slot = await Slot.findOne({ where: { slotNumber } });

    if (!slot) {
      return res.status(404).send({ message: "Slot not found" });
    }

    if (!slot.isOccupied) {
      return res.status(400).send({ message: "Slot is already vacant" });
    }

    slot.isOccupied = false;
    await slot.save();
    res
      .status(200)
      .send({ message: `Slot ${slotNumber} released successfully` });
  } catch (err) {
    console.error("Failed to release slot:", err);
    res.status(500).send({ message: "Failed to release slot" });
  }
};
