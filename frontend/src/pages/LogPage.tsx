import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

interface LogEntry {
  productName: string;
  action: '입고' | '출고';
  timestamp: string;
  slotNumber: number;
}

function LogPage() {
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>(''); // 검색어 상태 추가
  const navigate = useNavigate();

  const fetchLogs = async () => {
    try {
      const response = await axios.get('http://localhost:8080/api/logs');
      console.log('입출고 로그 데이터:', response.data);
      setLogs(response.data);
    } catch (error) {
      console.error('로그 데이터를 불러오는 중 오류 발생:', error);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, []);

  // 제품 이름으로 필터링된 로그 데이터
  const filteredLogs = logs.filter((log) =>
    log.productName.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  return (
    <div className="min-h-screen bg-gray-800 p-6 text-white">
      {/* 상단 헤더 영역에 입고, 출고, 뒤로가기 버튼 추가 */}
      <div className="mb-6 flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">입출고 로그</h1>
          <div className="flex gap-2">
            <button
              onClick={() => navigate('/in')}
              className="rounded-lg bg-green-500 px-4 py-2 text-white transition hover:bg-green-600"
            >
              입고
            </button>
            <button
              onClick={() => navigate('/out')}
              className="rounded-lg bg-red-500 px-4 py-2 text-white transition hover:bg-red-600"
            >
              출고
            </button>
            <button
              onClick={() => navigate('/inventory')}
              className="rounded-lg bg-blue-500 px-4 py-2 text-white transition hover:bg-blue-600"
            >
              뒤로가기
            </button>
          </div>
        </div>
        {/* 검색 입력 필드 추가 */}
        <div>
          <input
            type="text"
            placeholder="제품 이름으로 검색..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full rounded-lg p-2 text-black"
          />
        </div>
      </div>

      <div className="rounded-lg bg-gray-700 p-6">
        {filteredLogs.length === 0 ? (
          <p className="text-center">로그 데이터가 없습니다.</p>
        ) : (
          <table className="w-full table-auto text-left">
            <thead>
              <tr>
                <th className="border-b border-gray-600 px-4 py-2">
                  제품 이름
                </th>
                <th className="border-b border-gray-600 px-4 py-2">동작</th>
                <th className="border-b border-gray-600 px-4 py-2">
                  슬롯 번호
                </th>
                <th className="border-b border-gray-600 px-4 py-2">시간</th>
              </tr>
            </thead>
            <tbody>
              {filteredLogs.map((log, index) => (
                <tr key={index}>
                  <td className="border-b border-gray-600 px-4 py-2">
                    {log.productName}
                  </td>
                  <td className="border-b border-gray-600 px-4 py-2">
                    {log.action}
                  </td>
                  <td className="border-b border-gray-600 px-4 py-2">
                    {log.slotNumber}
                  </td>
                  <td className="border-b border-gray-600 px-4 py-2">
                    {new Date(log.timestamp).toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

export default LogPage;
