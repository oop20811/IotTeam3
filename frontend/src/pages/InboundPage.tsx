import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

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
            disabled={occupiedSlots.includes(slot)} // 점유된 슬롯은 비활성화
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
  const navigate = useNavigate();

  const fetchSlots = async () => {
    try {
      const response = await axios.get('http://localhost:8080/api/slots');
      console.log('슬롯 데이터:', response.data); // 브라우저 콘솔에 출력
      setSlots(response.data);

      const occupied = response.data
        .filter((slot) => slot.isOccupied)
        .map((slot) => slot.slotNumber);
      setOccupiedSlots(occupied);
    } catch (err) {
      console.error('슬롯 데이터를 불러오는 중 오류 발생:', err);
    }
  };

  useEffect(() => {
    fetchSlots(); // 컴포넌트 마운트 시 슬롯 데이터 가져오기
  }, []);

  const handleComplete = async () => {
    if (!productName || !selectedFile || selectedSlot === null) {
      alert('모든 필드를 입력하세요!');
      return;
    }

    console.log('전송 데이터:', {
      slotNumber: selectedSlot,
      productName,
      file: selectedFile,
    });

    try {
      const formData = new FormData();
      formData.append('slotNumber', selectedSlot.toString());
      formData.append('productName', productName);
      formData.append('file', selectedFile);

      // 제품 저장 요청
      const response = await axios.post(
        'http://localhost:8080/api/products',
        formData,
        {
          headers: { 'Content-Type': 'multipart/form-data' },
        },
      );

      // 로그 저장 요청
      await axios.post('http://localhost:8080/api/logs', {
        productName: productName, // productName 필드 추가
        action: '입고',
        details: `Slot ${selectedSlot}: ${productName} 입고됨`,
      });

      alert('제품이 성공적으로 저장되었습니다!');
      console.log('응답 데이터:', response.data);

      setSelectedSlot(null);
      setProductName('');
      setSelectedFile(null);
      fetchSlots(); // 저장 후 슬롯 상태 갱신
      navigate('/main'); // 출고 페이지로 이동
    } catch (err) {
      console.error('제품 저장 실패:', err);
    }
  };

  return (
    <div className="min-h-screen bg-gray-800 p-6 text-white">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-3xl font-bold">Inbound Page</h1>
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
          className="rounded-lg bg-green-500 px-6 py-3 shadow-md transition hover:bg-green-600"
        >
          완료
        </button>
        <button
          onClick={() => navigate('/main')}
          className="rounded-lg bg-red-500 px-6 py-3 shadow-md transition hover:bg-red-600"
        >
          출고로 이동
        </button>
      </div>
    </div>
  );
};

export default InboundPage;
