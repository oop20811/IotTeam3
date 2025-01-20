import React from 'react';
import { useNavigate } from 'react-router-dom';

const MainPage: React.FC = () => {
  const navigate = useNavigate();

  const handleNavigateToInbound = () => {
    navigate('/inbound');
  };

  const handleNavigateToInventory = () => {
    navigate('/inventory');
  };

  const handleNavigateToRelease = () => {
    navigate('/release');
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-800 text-white">
      <h1 className="mb-8 text-3xl font-bold">Smart Factory System</h1>
      <div className="flex gap-4">
        <button
          onClick={handleNavigateToInbound}
          className="rounded-lg bg-blue-500 px-6 py-3 shadow-md transition hover:bg-blue-600"
        >
          입고
        </button>
        <button
          onClick={handleNavigateToRelease}
          className="rounded-lg bg-green-500 px-6 py-3 shadow-md transition hover:bg-green-600"
        >
          출고
        </button>
        <button
          onClick={handleNavigateToInventory}
          className="rounded-lg bg-yellow-500 px-6 py-3 shadow-md transition hover:bg-yellow-600"
        >
          재고
        </button>
      </div>
    </div>
  );
};

export default MainPage;
