import React, { useEffect, useState } from 'react';
import { getSlots, occupySlot } from '../services/slot.service';

interface ProductInputProps {
  id: number;
  occupiedSlots: number[];
  setOccupiedSlots: React.Dispatch<React.SetStateAction<number[]>>;
}

const ProductInput: React.FC<ProductInputProps> = ({
  id,
  occupiedSlots,
  setOccupiedSlots,
}) => {
  const [slots, setSlots] = useState<
    { slotNumber: number; isOccupied: boolean }[]
  >([]);

  useEffect(() => {
    fetchSlots();
  }, []);

  const fetchSlots = async () => {
    const data = await getSlots();
    setSlots(data);
  };

  const handleSlotSelect = async (slot: number) => {
    if (!occupiedSlots.includes(slot)) {
      await occupySlot(slot);
      setOccupiedSlots([...occupiedSlots, slot]);
    }
  };
  interface ProductInputProps {
    id: number;
    occupiedSlots: number[];
    setOccupiedSlots: React.Dispatch<React.SetStateAction<number[]>>;
    onSlotSelect: (slot: number) => void; // 슬롯 선택 콜백 추가
  }

  const ProductInput: React.FC<ProductInputProps> = ({
    id,
    occupiedSlots,
    setOccupiedSlots,
    onSlotSelect,
  }) => {
    const [selectedSlot, setSelectedSlot] = useState<number | null>(null);

    const handleSlotSelect = (slot: number) => {
      if (!occupiedSlots.includes(slot)) {
        setSelectedSlot(slot);
        onSlotSelect(slot); // 부모 컴포넌트에 슬롯 전달
      }
    };

    return (
      <div className="flex flex-col gap-2 rounded-lg border bg-gray-100 p-4">
        <label className="font-medium">제품 사진 {id + 1}</label>
        <input type="file" className="rounded-md border p-2" accept="image/*" />
        <label className="font-medium">제품 이름</label>
        <input
          type="text"
          placeholder="제품 이름을 입력하세요"
          className="rounded-md border p-2 text-black"
        />
        <label className="font-medium">제품 입고 위치 번호</label>
        <div className="flex gap-2">
          {[1, 2, 3, 4, 5, 6].map((slot) => (
            <button
              key={slot}
              onClick={() => handleSlotSelect(slot)}
              className={`rounded-md px-4 py-2 text-white transition ${
                occupiedSlots.includes(slot)
                  ? 'cursor-not-allowed bg-gray-400'
                  : selectedSlot === slot
                    ? 'bg-blue-500 hover:bg-blue-600'
                    : 'bg-green-500 hover:bg-green-600'
              }`}
              disabled={occupiedSlots.includes(slot)}
            >
              {occupiedSlots.includes(slot) ? '사용불가' : slot}
            </button>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="flex flex-col gap-2 rounded-lg border bg-gray-100 p-4">
      <label className="font-medium">제품 사진 {id + 1}</label>
      <input type="file" className="rounded-md border p-2" accept="image/*" />
      <label className="font-medium">제품 이름</label>
      <input
        type="text"
        placeholder="제품 이름을 입력하세요"
        className="rounded-md border p-2 text-black"
      />
      <label className="font-medium">제품 입고 위치 번호</label>
      <div className="flex gap-2">
        {slots.map((slot) => (
          <button
            key={slot.slotNumber}
            onClick={() => handleSlotSelect(slot.slotNumber)}
            className={`rounded-md px-4 py-2 text-white transition ${
              slot.isOccupied
                ? 'cursor-not-allowed bg-gray-400'
                : 'bg-green-500 hover:bg-green-600'
            }`}
            disabled={slot.isOccupied}
          >
            {slot.isOccupied ? '사용불가' : slot.slotNumber}
          </button>
        ))}
      </div>
    </div>
  );
};

export default ProductInput;
