import React from 'react';
import { Play, Pause, RotateCcw, Shuffle, Settings2, ChevronDown, Save, UploadCloud } from 'lucide-react';

const ALGORITHMS = [
  { value: 'bubbleSort', label: 'Bubble Sort' },
  { value: 'mergeSort', label: 'Merge Sort' },
  { value: 'quickSort', label: 'Quick Sort' },
  // Add more algorithms here later
];

const ControlPanel = ({
  algorithm,
  onAlgorithmChange,
  speed,
  onSpeedChange,
  arraySize,
  onArraySizeChange,
  onGenerateNewArray,
  onStart,
  onPause,
  onReset,
  onSaveSession, // New prop
  onLoadSession, // New prop
  comparisonCount, // New prop
  swapCount,       // New prop
  isSorting,
  isPaused,
  minArraySize = 5,
  maxArraySize = 100,
  minSpeed = 10,
  maxSpeed = 1000,
}) => {
  return (
    <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-xl space-y-6"> {/* Removed h-full to let content define height */}
      <div>
        <label htmlFor="algorithm-select" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Algorithm
        </label>
        <div className="relative">
          <select
            id="algorithm-select"
            value={algorithm}
            onChange={(e) => onAlgorithmChange(e.target.value)}
            disabled={isSorting}
            className="w-full pl-3 pr-10 py-2 text-base border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md उपस्थिति-none dark:bg-gray-700 dark:text-white disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {ALGORITHMS.map((algo) => (
              <option key={algo.value} value={algo.value}>
                {algo.label}
              </option>
            ))}
          </select>
          <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 dark:text-gray-500 pointer-events-none" />
        </div>
      </div>

      <div>
        <label htmlFor="array-size-slider" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Array Size: <span className="font-semibold text-blue-600 dark:text-blue-400">{arraySize}</span>
        </label>
        <input
          type="range"
          id="array-size-slider"
          min={minArraySize}
          max={maxArraySize}
          value={arraySize}
          onChange={(e) => onArraySizeChange(Number(e.target.value))}
          disabled={isSorting}
          className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed accent-blue-500 dark:accent-blue-400"
        />
      </div>

      <div>
        <label htmlFor="speed-slider" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Speed: <span className="font-semibold text-blue-600 dark:text-blue-400">{speed}ms</span>
        </label>
        <input
          type="range"
          id="speed-slider"
          min={minSpeed}
          max={maxSpeed}
          step="10" // Or make it dynamic based on min/max
          value={speed}
          onChange={(e) => onSpeedChange(Number(e.target.value))}
          // Speed can be changed during sorting
          className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer accent-blue-500 dark:accent-blue-400"
        />
         <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Slower ← → Faster</p>
      </div>

      <button
        onClick={onGenerateNewArray}
        disabled={isSorting}
        className="w-full flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:bg-blue-500 dark:hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <Shuffle size={18} className="mr-2" />
        Generate New Array
      </button>

      {/* Input for custom array - basic version for now */}
      {/* <div>
        <label htmlFor="custom-array" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Custom Array (comma-separated)
        </label>
        <input
          type="text"
          id="custom-array"
          placeholder="e.g., 5,3,8,1"
          disabled={isSorting}
          className="w-full px-3 py-2 text-sm border-gray-300 dark:border-gray-600 rounded-md focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white disabled:opacity-50"
          // Add onChange handler to update a local state and then a button to submit it
        />
      </div> */}

      <div className="grid grid-cols-3 gap-2 pt-4 border-t border-gray-200 dark:border-gray-700">
        <button
          onClick={onStart}
          disabled={isSorting && !isPaused}
          className="col-span-2 flex items-center justify-center px-4 py-2.5 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 dark:bg-green-500 dark:hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSorting && !isPaused ? <Settings2 size={18} className="mr-2 animate-spin" /> : <Play size={18} className="mr-2" />}
          {isSorting && !isPaused ? 'Sorting...' : (isPaused ? 'Resume' : 'Start')}
        </button>
        <button
          onClick={onPause}
          disabled={!isSorting || isPaused}
          className="flex items-center justify-center px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Pause size={18} className="mr-2" />
          Pause
        </button>
      </div>
      <button
          onClick={onReset}
          // No specific disabled condition for reset, it should always be available to stop and clear.
          className="w-full flex items-center justify-center px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
        >
          <RotateCcw size={18} className="mr-2" />
          Reset
        </button>

      {/* Save/Load Session Buttons */}
      <div className="pt-4 border-t border-gray-200 dark:border-gray-700 space-y-2">
        <button
            onClick={onSaveSession}
            disabled={isSorting} // Disable if sorting is active
            className="w-full flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:bg-indigo-500 dark:hover:bg-indigo-600 disabled:opacity-50"
        >
            <Save size={18} className="mr-2" />
            Save Session
        </button>
        <button
            onClick={onLoadSession}
            disabled={isSorting} // Disable if sorting is active
            className="w-full flex items-center justify-center px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
        >
            <UploadCloud size={18} className="mr-2" />
            Load Session
        </button>
      </div>

      {/* Statistics Display */}
      <div className="pt-4 border-t border-gray-200 dark:border-gray-700 space-y-1">
        <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Statistics:</h4>
        <p className="text-xs text-gray-600 dark:text-gray-400">
          Comparisons: <span className="font-semibold text-blue-600 dark:text-blue-400">{comparisonCount}</span>
        </p>
        <p className="text-xs text-gray-600 dark:text-gray-400">
          Swaps/Moves: <span className="font-semibold text-red-600 dark:text-red-400">{swapCount}</span>
        </p>
      </div>
    </div>
  );
};

export default ControlPanel;
