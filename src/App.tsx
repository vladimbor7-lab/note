import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Landing } from './pages/Landing';
import { Dashboard } from './pages/Dashboard';
import { TouristChat } from './pages/TouristChat';
import { SmartSelection } from './pages/SmartSelection';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/chat" element={<TouristChat />} />
        <Route path="/selection" element={<SmartSelection />} />
      </Routes>
    </BrowserRouter>
  );
}
