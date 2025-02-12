import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

interface SlotWithProduct {
  slotNumber: number;
  isOccupied: boolean;
  productName: string | null;
  productFilePath: string | null;
}

function ReleasePage() {
  const [slots, setSlots] = useState<SlotWithProduct[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  // 슬롯 및 제품 데이터 가져오기
  const fetchSlotsData = async () => {
    try {
      const response = await axios.get(
        'http://localhost:8080/api/slots/status',
      );
      console.log('슬롯 데이터:', response.data);
      setSlots(response.data);
    } catch (error) {
      console.error('슬롯 데이터를 불러오는 중 오류 발생:', error);
    }
  };

  // 특정 슬롯 출고 처리 및 15초 로딩 화면 표시
  const releaseSlot = async (slotNumber: number) => {
    try {
      await axios.post(`http://localhost:8080/api/slots/${slotNumber}/release`);
      alert(`Slot ${slotNumber}의 제품이 출고되었습니다.`);

      // 출고 성공 후 로딩 화면 표시
      setIsLoading(true);
      // 필요에 따라 슬롯 데이터를 갱신 (선택 사항)
      fetchSlotsData();

      setTimeout(() => {
        setIsLoading(false);
        navigate('/main');
      }, 20000);
    } catch (error) {
      console.error(`Slot ${slotNumber} 출고 실패:`, error);
      alert(`Slot ${slotNumber} 출고 중 오류가 발생했습니다.`);
    }
  };

  // 컴포넌트가 마운트될 때 슬롯 데이터 가져오기
  useEffect(() => {
    fetchSlotsData();
  }, []);

  // 로딩 중이면 바운싱 도트 애니메이션 적용된 로딩 화면 렌더링
  if (isLoading) {
    return (
      <motion.div
        className="flex min-h-screen flex-col items-center justify-center bg-gray-800"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        {/* 바운싱 도트 애니메이션 */}
        <div className="mb-6 flex space-x-2">
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              className="h-4 w-4 rounded-full bg-white"
              animate={{ y: [0, -15, 0] }}
              transition={{
                duration: 0.6,
                ease: 'easeInOut',
                repeat: Infinity,
                delay: i * 0.2,
              }}
            />
          ))}
        </div>
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-3xl font-bold text-white"
        >
          처리 중입니다.
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="mt-4 text-white"
        >
          잠시만 기다려주세요.
        </motion.p>
      </motion.div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-800 p-6 text-white">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-3xl font-bold">Release Page</h1>
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
                <>
                  {slot.productFilePath && (
                    <img
                      src={`http://localhost:8080${slot.productFilePath}`}
                      alt={slot.productName || '제품 이미지'}
                      className="mb-2 h-32 w-32 rounded-md object-cover"
                    />
                  )}
                  <p className="mb-2 text-center font-medium">
                    {slot.productName}
                  </p>
                  <button
                    onClick={() => releaseSlot(slot.slotNumber)}
                    className="rounded-lg bg-red-500 px-4 py-2 text-white transition hover:bg-red-600"
                  >
                    출고하기
                  </button>
                </>
              ) : (
                <div className="flex h-32 w-32 items-center justify-center rounded-md bg-gray-200">
                  <span className="font-medium text-green-600">입고 가능</span>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ReleasePage;
