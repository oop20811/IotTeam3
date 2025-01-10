import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import MainPage from './pages/MainPage';
import InboundPage from './pages/InboundPage';

import './App.css';

function App() {
  return (
    <>
      <Routes>
        <Route path="/main" element={<MainPage />} />
        <Route path="/inbound" element={<InboundPage />} />
      </Routes>
    </>
  );
}

export default App;
