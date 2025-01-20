import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

interface LogEntry {
  productName: string;
  action: '입고' | '출고';
  timestamp: string;
}

function LogPage() {
  const [logs, setLogs] = useState<LogEntry[]>([]);
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

  return (
    <div className="min-h-screen bg-gray-800 p-6 text-white">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-3xl font-bold">입출고 로그</h1>
        <button
          onClick={() => navigate('/inventory')}
          className="rounded-lg bg-blue-500 px-4 py-2 text-white transition hover:bg-blue-600"
        >
          뒤로가기
        </button>
      </div>
      <div className="rounded-lg bg-gray-700 p-6">
        {logs.length === 0 ? (
          <p className="text-center text-white">로그 데이터가 없습니다.</p>
        ) : (
          <table className="w-full table-auto text-left text-white">
            <thead>
              <tr>
                <th className="border-b border-gray-600 px-4 py-2">
                  제품 이름
                </th>
                <th className="border-b border-gray-600 px-4 py-2">동작</th>
                <th className="border-b border-gray-600 px-4 py-2">시간</th>
              </tr>
            </thead>
            <tbody>
              {logs.map((log, index) => (
                <tr key={index}>
                  <td className="border-b border-gray-600 px-4 py-2">
                    {log.productName}
                  </td>
                  <td className="border-b border-gray-600 px-4 py-2">
                    {log.action}
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
