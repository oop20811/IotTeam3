import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

interface SlotWithProduct {
  slotNumber: number;
  isOccupied: boolean;
  productName: string | null;
  productFilePath: string | null;
}

function InventoryPage() {
  const [slots, setSlots] = useState<SlotWithProduct[]>([]);
  const navigate = useNavigate();

  const fetchInventoryData = async () => {
    try {
      const response = await axios.get(
        'http://localhost:8080/api/slots/status',
      );
      console.log('슬롯 및 제품 데이터:', response.data);
      setSlots(response.data);
    } catch (error) {
      console.error('재고 데이터를 불러오는 중 오류 발생:', error);
    }
  };

  useEffect(() => {
    fetchInventoryData();
  }, []);

  return (
    <div className="min-h-screen bg-gray-800 p-6 text-white">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-3xl font-bold">Inventory</h1>
        <button
          onClick={() => navigate('/main')}
          className="rounded-lg bg-blue-500 px-4 py-2 text-white transition hover:bg-blue-600"
        >
          뒤로가기
        </button>
      </div>
      <div className="grid grid-cols-3 gap-6">
        {slots.map((slot) => (
          <div
            key={slot.slotNumber}
            className="flex h-[18rem] flex-col items-center justify-between rounded-lg border bg-gray-100 p-4 text-black"
          >
            <h2 className="font-bold">Slot {slot.slotNumber}</h2>
            <div className="flex flex-grow flex-col items-center justify-center">
              {slot.isOccupied ? (
                <img
                  src={`http://localhost:8080${slot.productFilePath}`}
                  alt={slot.productName || '제품 이미지'}
                  className="mb-2 h-32 w-32 rounded-md object-cover"
                />
              ) : (
                <div className="flex h-32 w-32 items-center justify-center rounded-md bg-gray-200">
                  <span className="font-medium text-green-600">입고 가능</span>
                </div>
              )}
            </div>
            {slot.isOccupied && (
              <p className="text-center font-medium">{slot.productName}</p>
            )}
          </div>
        ))}
      </div>
      <div className="absolute bottom-6 right-6">
        <button
          onClick={() => navigate('/logs')}
          className="rounded-lg bg-yellow-500 px-6 py-3 text-black transition hover:bg-yellow-600"
        >
          입출고 로그
        </button>
      </div>
    </div>
  );
}

export default InventoryPage;
