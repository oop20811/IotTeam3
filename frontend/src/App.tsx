import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import MainPage from './pages/MainPage';
import InboundPage from './pages/InboundPage';
import InventoryPage from './pages/InventoryPage';
import ReleasePage from './pages/ReleasePage';
import LogPage from './pages/LogPage';
import './App.css';

function App() {
  return (
    <>
      <Routes>
        <Route path="/main" element={<MainPage />} />
        <Route path="/inbound" element={<InboundPage />} />
        <Route path="/inventory" element={<InventoryPage />} />
        <Route path="/release" element={<ReleasePage />} />
        <Route path="/logs" element={<LogPage />} />
      </Routes>
    </>
  );
}

export default App;
