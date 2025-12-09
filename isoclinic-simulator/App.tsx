import React from 'react';
import { HashRouter, Routes, Route } from 'react-router-dom';
import IsometricMap from './components/IsometricMap';
import RoomDetail from './components/RoomDetail';
import MonitoringChat from './components/MonitoringChat';

const App: React.FC = () => {
  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<IsometricMap />} />
        <Route path="/doctor" element={<RoomDetail />} />
        <Route path="/monitoring" element={<MonitoringChat />} />
      </Routes>
    </HashRouter>
  );
};

export default App;
