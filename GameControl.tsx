import React from 'react';
import { ArrowUp, ArrowDown, ArrowLeft, ArrowRight, Play, Pause, RefreshCw } from 'lucide-react';

interface GameControlsProps {
  onStart: () => void;
  onPause: () => void;
  onReset: () => void;
  onDirectionChange: (direction: 'up' | 'down' | 'left' | 'right') => void;
  isPaused: boolean;
  isGameOver: boolean;
}

const GameControls: React.FC<GameControlsProps> = ({
  onStart,
  onPause,
  onReset,
  onDirectionChange,
  isPaused,
  isGameOver,
}) => {
  return (
    <div className="mt-6">
      <div className="flex justify-center mb-4">
        {!isGameOver && (
          <button
            onClick={isPaused ? onStart : onPause}
            className="mx-2 bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded flex items-center"
          >
            {isPaused ? <Play size={18} className="mr-1" /> : <Pause size={18} className="mr-1" />}
            {isPaused ? 'Resume' : 'Pause'}
          </button>
        )}
        <button
          onClick={onReset}
          className="mx-2 bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded flex items-center"
        >
          <RefreshCw size={18} className="mr-1" />
          Restart
        </button>
      </div>

      <div className="flex flex-col items-center space-y-2 md:hidden">
        <button
          onClick={() => onDirectionChange('up')}
          className="w-14 h-14 bg-gray-700 hover:bg-gray-600 text-white rounded-full flex items-center justify-center"
        >
          <ArrowUp size={24} />
        </button>
        <div className="flex space-x-2">
          <button
            onClick={() => onDirectionChange('left')}
            className="w-14 h-14 bg-gray-700 hover:bg-gray-600 text-white rounded-full flex items-center justify-center"
          >
            <ArrowLeft size={24} />
          </button>
          <button
            onClick={() => onDirectionChange('down')}
            className="w-14 h-14 bg-gray-700 hover:bg-gray-600 text-white rounded-full flex items-center justify-center"
          >
            <ArrowDown size={24} />
          </button>
          <button
            onClick={() => onDirectionChange('right')}
            className="w-14 h-14 bg-gray-700 hover:bg-gray-600 text-white rounded-full flex items-center justify-center"
          >
            <ArrowRight size={24} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default GameControls;
