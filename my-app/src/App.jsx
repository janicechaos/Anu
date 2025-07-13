import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Task2ActivityChoice from './pages/Task2ActivityChoice';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/task-selection" element={<Task2ActivityChoice />} />
      </Routes>
    </Router>
  );
}
<div className="text-3xl font-bold text-pink-600">
  Tailwind is working 🎉
</div>

export default App;