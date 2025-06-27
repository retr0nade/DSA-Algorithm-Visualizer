import React from 'react';
import { motion } from 'framer-motion';

// Define color mapping for bar states
export const BAR_COLORS = {
  default: 'bg-blue-500 dark:bg-blue-400',
  compare: 'bg-yellow-500 dark:bg-yellow-400',
  swap: 'bg-red-500 dark:bg-red-400',
  sorted: 'bg-green-500 dark:bg-green-400',
  pivot: 'bg-purple-500 dark:bg-purple-400', // For QuickSort pivot
};

const BarChart = ({ array, barStates, arraySize }) => {
  if (!array || array.length === 0) {
    return <div className="flex justify-center items-center h-64 text-gray-500 dark:text-gray-400">No array data to display.</div>;
  }

  const maxVal = Math.max(...array, 100); // Ensure maxVal is at least 100 for consistent height scaling if array is small.

  return (
    <div className="flex justify-start items-end w-full h-full bg-gray-100 dark:bg-gray-700 p-2 rounded-lg shadow-inner min-h-[100px]">
      {array.map((value, idx) => {
        const state = barStates[idx] || 'default'; // Default to 'default' if no state provided
        const colorClass = BAR_COLORS[state] || BAR_COLORS.default;

        // Calculate width dynamically. Ensure it doesn't get too small.
        // Max width per bar is around 50px, min is around 2px.
        const barWidthPercentage = Math.min(20, Math.max(0.5, (100 / arraySize) * 0.8)); // 80% of available slot, capped.
        const marginPercentage = (100 / arraySize) * 0.1; // 10% margin on each side of the bar slot.

        return (
          <motion.div
            key={idx}
            // layout // Animate layout changes (e.g. when array size changes) - can be performance intensive
            initial={{ height: 0, opacity: 0 }}
            animate={{
              height: `${(value / maxVal) * 100}%`,
              opacity: 1
            }}
            transition={{ type: 'spring', stiffness: 100, damping: 20 }} // Duration is inherent to spring
            className={`text-white text-xs text-center rounded-t-sm transition-colors duration-150 ease-in-out ${colorClass}`} // Slightly faster color transition
            style={{
              width: `${barWidthPercentage}%`,
              margin: `0 ${marginPercentage}%`,
            }}
            title={`Value: ${value}${barStates[idx] ? ` (${barStates[idx]})` : ''}`}
          >
            {/* Display value if bars are wide enough and value is significant */}
            {arraySize <= 30 && value > 0 ? (
              <span className="relative bottom-[-20px] text-gray-800 dark:text-gray-200 text-xxs sm:text-xs">
                {value}
              </span>
            ) : ''}
          </motion.div>
        );
      })}
    </div>
  );
};

export default BarChart;
