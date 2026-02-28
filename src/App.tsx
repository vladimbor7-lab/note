import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { NotesApp } from './pages/NotesApp';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<NotesApp />} />
      </Routes>
    </BrowserRouter>
  );
}
