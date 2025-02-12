import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { motion } from 'framer-motion';

interface ProductInputProps {
  id: number;
  occupiedSlots: number[];
  selectedSlot: number | null;
  setSelectedSlot: React.Dispatch<React.SetStateAction<number | null>>;
  productName: string;
  setProductName: React.Dispatch<React.SetStateAction<string>>;
  selectedFile: File | null;
  setSelectedFile: React.Dispatch<React.SetStateAction<File | null>>;
}

const ProductInput: React.FC<ProductInputProps> = ({
  id,
  occupiedSlots,
  selectedSlot,
  setSelectedSlot,
  productName,
  setProductName,
  selectedFile,
  setSelectedFile,
}) => {
  const handleSlotSelect = (slot: number) => {
    if (!occupiedSlots.includes(slot)) {
      setSelectedSlot(slot);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setSelectedFile(e.target.files[0]);
    }
  };

  return (
    <div className="flex flex-col gap-2 rounded-lg border bg-gray-100 p-4">
      <label className="font-medium">제품 사진 {id + 1}</label>
      <input
        type="file"
        className="rounded-md border p-2"
        accept="image/*"
        onChange={handleFileChange}
      />
      <label className="font-medium">제품 이름</label>
      <input
        type="text"
        placeholder="제품 이름을 입력하세요"
        className="rounded-md border p-2 text-black"
        value={productName}
        onChange={(e) => setProductName(e.target.value)}
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
            {occupiedSlots.includes(slot) ? '사용중' : slot}
          </button>
        ))}
      </div>
    </div>
  );
};

const InboundPage: React.FC = () => {
  const [slots, setSlots] = useState<
    { slotNumber: number; isOccupied: boolean }[]
  >([]);
  const [occupiedSlots, setOccupiedSlots] = useState<number[]>([]);
  const [selectedSlot, setSelectedSlot] = useState<number | null>(null);
  const [productName, setProductName] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const fetchSlots = async () => {
    try {
      const response = await axios.get('http://localhost:8080/api/slots');
      setSlots(response.data);
      const occupied = response.data
        .filter((slot: any) => slot.isOccupied)
        .map((slot: any) => slot.slotNumber);
      setOccupiedSlots(occupied);
    } catch (err) {
      console.error('슬롯 데이터를 불러오는 중 오류 발생:', err);
    }
  };

  useEffect(() => {
    fetchSlots();
  }, []);

  const handleComplete = async () => {
    if (!productName || !selectedFile || selectedSlot === null) {
      alert('모든 필드를 입력하세요!');
      return;
    }

    try {
      const formData = new FormData();
      formData.append('productName', productName);
      formData.append('file', selectedFile);

      // 입고 요청 (파일 포함) - 이 호출이 MQTT 명령 역할을 함
      await axios.post(
        `http://localhost:8080/api/slots/${selectedSlot}/inbound`,
        formData,
        {
          headers: { 'Content-Type': 'multipart/form-data' },
        },
      );

      alert('제품이 성공적으로 입고되었습니다!');
      setIsLoading(true);
      // 상태 초기화
      setSelectedSlot(null);
      setProductName('');
      setSelectedFile(null);
      fetchSlots();

      // 15초 후 로딩 해제 후 /main으로 이동
      setTimeout(() => {
        setIsLoading(false);
        navigate('/main');
      }, 20000);
    } catch (err) {
      console.error('입고 처리 실패:', err);
      alert('입고 처리 중 오류가 발생했습니다.');
    }
  };

  // 로딩 화면 렌더링 (바운싱 도트 애니메이션 적용)
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
    <div className="min-h-screen bg-gray-800 p-6 text-black">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-3xl font-bold text-white">Inbound Page</h1>
        <button
          onClick={() => navigate('/main')}
          className="rounded-lg bg-blue-500 px-4 py-2 text-white transition hover:bg-blue-600"
        >
          뒤로가기
        </button>
      </div>
      <div className="flex flex-col gap-4">
        <ProductInput
          id={0}
          occupiedSlots={occupiedSlots}
          selectedSlot={selectedSlot}
          setSelectedSlot={setSelectedSlot}
          productName={productName}
          setProductName={setProductName}
          selectedFile={selectedFile}
          setSelectedFile={setSelectedFile}
        />
      </div>
      <div className="mt-4 flex gap-4">
        <button
          onClick={handleComplete}
          className="rounded-lg bg-green-500 px-6 py-3 text-white shadow-md transition hover:bg-green-600"
        >
          완료
        </button>
      </div>
    </div>
  );
};

export default InboundPage;
