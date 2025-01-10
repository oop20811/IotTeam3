import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

interface ProductInputProps {
  id: number;
}

const ProductInput: React.FC<ProductInputProps> = ({ id }) => {
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
      <label className="font-medium">제품 수량</label>
      <input
        type="number"
        placeholder="수량을 입력하세요"
        className="rounded-md border p-2 text-black"
      />
    </div>
  );
};

const InboundPage: React.FC = () => {
  const [components, setComponents] = useState<number[]>([0]); // 기본으로 1개의 컴포넌트 포함
  const navigate = useNavigate(); // React Router의 useNavigate 훅

  const handleAddComponent = () => {
    if (components.length < 3) {
      setComponents([...components, components.length]);
    }
  };

  const handleRelease = () => {
    alert('출고로 이동.');
  };

  const handleComplete = () => {
    alert('입고가 완료되었습니다.');
    navigate('/main'); // 메인 페이지로 이동
  };

  return (
    <div className="min-h-screen bg-gray-800 p-6 text-white">
      <h1 className="mb-6 text-3xl font-bold">Inbound Page</h1>

      {/* 추가 버튼 */}
      <button
        onClick={handleAddComponent}
        className={`mb-4 rounded-lg bg-blue-500 px-6 py-3 shadow-md transition hover:bg-blue-600 ${
          components.length >= 3 ? 'cursor-not-allowed opacity-50' : ''
        }`}
        disabled={components.length >= 3}
      >
        + 추가
      </button>

      {/* 입력 컴포넌트 */}
      <div className="flex flex-col gap-4">
        {components.map((id) => (
          <ProductInput key={id} id={id} />
        ))}
      </div>

      {/* 출고 및 완료 버튼 */}
      <div className="mt-4 flex gap-4">
        <button
          onClick={handleRelease}
          className="rounded-lg bg-red-500 px-6 py-3 shadow-md transition hover:bg-red-600"
        >
          출고하기
        </button>
        <button
          onClick={handleComplete}
          className="rounded-lg bg-green-500 px-6 py-3 shadow-md transition hover:bg-green-600"
        >
          완료
        </button>
      </div>
    </div>
  );
};

export default InboundPage;
