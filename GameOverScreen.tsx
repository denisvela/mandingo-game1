import React from 'react';

interface GameOverScreenProps {
  score: number;
  onRestart: () => void;
}

const GameOverScreen: React.FC<GameOverScreenProps> = ({ score, onRestart }) => {
  return (
    <div className="absolute inset-0 bg-black bg-opacity-80 flex flex-col items-center justify-center">
      <img 
        src="https://sora.chatgpt.com/g/gen_01jvc80nz4ehgvty1pwy2gpnhj" 
        alt="Game Over"
        className="w-64 h-64 object-cover rounded-full mb-6 border-4 border-red-500"
      />
      <h2 className="text-red-500 text-4xl font-bold mb-4">Game Over</h2>
      <p className="text-white text-2xl mb-6">Score: {score}</p>
      <button
        onClick={onRestart}
        className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-6 rounded-lg text-xl transition-all transform hover:scale-105"
      >
        Play Again
      </button>
    </div>
  );
};

export default GameOverScreen;
