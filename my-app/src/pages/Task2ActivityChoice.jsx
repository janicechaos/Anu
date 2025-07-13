import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function Task2ActivityChoice() {
  const navigate = useNavigate();

  const handleChoice = (choice) => {
    navigate(`/activities/${choice}`);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-400 via-pink-400 to-indigo-500 px-6">
      <div className="w-full max-w-md bg-white bg-opacity-10 backdrop-blur-lg rounded-3xl shadow-xl p-8">
        <h1 className="text-2xl font-bold text-white text-center mb-6">
          What kind of activity do you want today?
        </h1>

        <div className="space-y-4">
          <button
            onClick={() => handleChoice('mental')}
            className="w-full bg-white bg-opacity-20 hover:bg-opacity-30 text-white text-lg py-3 rounded-xl shadow-lg transition duration-300"
          >
            🧠 Mental Health Activities
          </button>

          <button
            onClick={() => handleChoice('physical')}
            className="w-full bg-white bg-opacity-20 hover:bg-opacity-30 text-white text-lg py-3 rounded-xl shadow-lg transition duration-300"
          >
            🏃 Physical Health Activities
          </button>

          <button
            onClick={() => handleChoice('both')}
            className="w-full bg-white bg-opacity-20 hover:bg-opacity-30 text-white text-lg py-3 rounded-xl shadow-lg transition duration-300"
          >
            🌈 Both
          </button>
        </div>
      </div>
    </div>
  );
}
