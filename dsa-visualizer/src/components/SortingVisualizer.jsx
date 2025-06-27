import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion } from 'framer-motion'; // Import motion
import BarChart, { BAR_COLORS } from './BarChart';
import ControlPanel from './ControlPanel';
import PseudocodeCard from './PseudocodeCard';
import { getBubbleSortAnimations, getMergeSortAnimations, getQuickSortAnimations } from '../utils/sortingAlgorithms';
import sleep from '../utils/sleep';

// Default settings
// Moved MIN/MAX constants for array size and speed here to pass to ControlPanel if needed, or keep them in ControlPanel
const MIN_ARRAY_SIZE = 5;
const MAX_ARRAY_SIZE = 100;
const DEFAULT_ARRAY_SIZE = 20;
const MIN_SPEED = 10; // ms
const MAX_SPEED = 1000; // ms
const DEFAULT_SPEED = 100; // ms
const DEFAULT_ALGORITHM = 'bubbleSort';

// Helper to generate random numbers in a range
const randomIntFromInterval = (min, max) => {
  return Math.floor(Math.random() * (max - min + 1) + min);
};

const SortingVisualizer = () => {
  const [array, setArray] = useState([]);
  const [arraySize, setArraySize] = useState(DEFAULT_ARRAY_SIZE);
  const [algorithm, setAlgorithm] = useState(DEFAULT_ALGORITHM);
  const [speed, setSpeed] = useState(DEFAULT_SPEED);
  const [isSorting, setIsSorting] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [barStates, setBarStates] = useState({}); // Object to hold state for each bar index, e.g., {0: 'compare', 1: 'swap'}
  const [comparisonCount, setComparisonCount] = useState(0);
  const [swapCount, setSwapCount] = useState(0);

  const animationFrameId = useRef(null); // For cancelling animation loop if needed
  const currentAnimationStep = useRef(0);
  const animationStepsCache = useRef([]);

  // Function to generate a new random array
  const resetArray = useCallback(() => {
    if (isSorting) return; // Don't reset if sorting is in progress
    const newArray = [];
    for (let i = 0; i < arraySize; i++) {
      newArray.push(randomIntFromInterval(5, 100)); // Array values between 5 and 100
    }
    setArray(newArray);
    const initialBarStates = {};
    // newArray.forEach((_, index) => initialBarStates[index] = 'default');
    setBarStates({});
    setIsSorting(false);
    setIsPaused(false);
    currentAnimationStep.current = 0;
    animationStepsCache.current = [];
    if (animationFrameId.current) {
      clearTimeout(animationFrameId.current); // Use clearTimeout if sleep uses setTimeout
      animationFrameId.current = null;
    }
    setComparisonCount(0);
    setSwapCount(0);
    console.log('Array reset:', newArray);
  }, [arraySize, isSorting]); // isSorting is a dependency to allow reset even if sorting.

  // Generate initial array on component mount
  useEffect(() => {
    resetArray();
  }, [resetArray]); // resetArray dependency is fine due to useCallback

  const handleAlgorithmChange = (newAlgorithm) => {
    if (isSorting) return;
    setAlgorithm(newAlgorithm);
  };

  const handleSpeedChange = (newSpeed) => {
    setSpeed(newSpeed);
  };

  const handleArraySizeChange = (newSize) => {
    if (isSorting) return;
    const size = Math.max(MIN_ARRAY_SIZE, Math.min(MAX_ARRAY_SIZE, newSize));
    setArraySize(size);
    // Note: resetArray will be called in useEffect for arraySize if we add it as a dependency
    // or we can call it directly here. For now, let's regenerate it in the next effect.
  };

  // Effect to regenerate array when size changes
   useEffect(() => {
    resetArray();
  }, [arraySize]); // Only listen to arraySize changes

  const processNextAnimationStep = useCallback(async () => {
    if (isPaused || currentAnimationStep.current >= animationStepsCache.current.length) {
      if (currentAnimationStep.current >= animationStepsCache.current.length) {
        setIsSorting(false);
        setIsPaused(false);
        // Final sorted state indication (e.g., all green)
        const finalBarStates = {};
        array.forEach((_, index) => finalBarStates[index] = 'sorted');
        setBarStates(finalBarStates);
        console.log('Sorting finished!');
      }
      return;
    }

    const step = animationStepsCache.current[currentAnimationStep.current];
    const newBarStates = { ...barStates }; // Start with current states

    // Clear previous comparison/pivot states before applying new ones, unless it's a 'sorted' state
    Object.keys(newBarStates).forEach(key => {
        if (newBarStates[key] !== 'sorted' && newBarStates[key] !== 'pivot_on') { // Don't clear sorted or active pivot
            delete newBarStates[key];
        }
    });

    switch (step.type) {
      case 'compare':
        step.indices.forEach(idx => newBarStates[idx] = 'compare');
        setComparisonCount(prev => prev + 1);
        break;
      case 'swap': // For BubbleSort & QuickSort actual swaps
        step.indices.forEach(idx => newBarStates[idx] = 'swap');
        setSwapCount(prev => prev + 1);
        // The array update is usually a subsequent 'update_array' step
        break;
      case 'update_array': // For algorithms that provide full array state after a swap
        setArray([...step.array]);
        // The swap itself was already counted. This step just updates the visual array.
        // If a swap step implicitly means array update, then this 'update_array' might not be needed
        // or swap count could be here. Current design: 'swap' step is the logical swap operation.
        break;
      case 'overwrite': // For MergeSort data movements
        setArray(prevArray => {
          const nextArray = [...prevArray];
          nextArray[step.index] = step.value;
          return nextArray;
        });
        newBarStates[step.index] = 'swap'; // Use 'swap' color for overwrite visualization
        setSwapCount(prev => prev + 1); // Count overwrite as a data movement/swap
        break;
      case 'sorted':
        newBarStates[step.index] = 'sorted';
        break;
      case 'pivot_on':
        newBarStates[step.index] = 'pivot_on';
        break;
      case 'pivot_off':
        // Pivot is now sorted, or state will be cleared by next comparison step
        // If we want to explicitly turn it off (e.g. back to default or sorted)
        if (newBarStates[step.index] === 'pivot_on') delete newBarStates[step.index];
        break;
      default:
        break;
    }

    setBarStates(newBarStates);
    currentAnimationStep.current += 1;

    animationFrameId.current = setTimeout(processNextAnimationStep, speed);
  }, [isPaused, speed, array, barStates]); // Add barStates here

  const startSorting = useCallback(() => {
    if (isSorting && !isPaused) return; // Already sorting and not paused

    if (isPaused) { // Resuming
      setIsPaused(false);
      // processNextAnimationStep will be called due to isPaused state change if already in loop,
      // or kick it off if it was the first pause.
      // animationFrameId.current = setTimeout(processNextAnimationStep, speed); // Re-kick if needed
      console.log('Resuming sort...');
      return; // processNextAnimationStep will handle it due to state change.
    }

    // Starting new sort
    currentAnimationStep.current = 0;
    setBarStates({}); // Clear previous bar states
    setComparisonCount(0); // Reset counts for new sort
    setSwapCount(0);      // Reset counts for new sort
    setIsSorting(true);
    setIsPaused(false);

    let animations;
    const currentArray = [...array]; // Use a fresh copy for the algorithm

    switch (algorithm) {
      case 'bubbleSort':
        animations = getBubbleSortAnimations(currentArray);
        break;
      case 'mergeSort':
        animations = getMergeSortAnimations(currentArray);
        break;
      case 'quickSort':
        animations = getQuickSortAnimations(currentArray);
        break;
      default:
        animations = [];
    }
    animationStepsCache.current = animations;

    if (animations.length > 0) {
      // processNextAnimationStep(); // Start processing, it will set its own timeout
      animationFrameId.current = setTimeout(processNextAnimationStep, 0); // Start immediately
    } else {
      setIsSorting(false); // No animations, probably already sorted or empty
      const finalBarStates = {};
      array.forEach((_, index) => finalBarStates[index] = 'sorted');
      setBarStates(finalBarStates);
    }
    console.log(`Starting ${algorithm} with ${animations.length} animation steps.`);
  }, [isSorting, isPaused, array, algorithm, speed, processNextAnimationStep]);


  // Effect to trigger processNextAnimationStep when isPaused changes from true to false (resuming)
  useEffect(() => {
    if (isSorting && !isPaused && animationStepsCache.current.length > 0 && currentAnimationStep.current < animationStepsCache.current.length) {
        // We are in a sorting process, and it's been unpaused.
        // processNextAnimationStep is already designed to check isPaused.
        // Kick off the loop if it's not already running.
        // The check for animationFrameId.current might be needed if pause clears it.
        // For simplicity, let's assume processNextAnimationStep handles the loop continuation.
        animationFrameId.current = setTimeout(processNextAnimationStep, speed);
    }
  }, [isPaused, isSorting, processNextAnimationStep, speed]);


  const pauseSorting = () => {
    if (!isSorting || isPaused) return;
    setIsPaused(true);
    if (animationFrameId.current) {
      clearTimeout(animationFrameId.current);
      animationFrameId.current = null;
    }
    console.log('Pausing sort...');
  };

  const resetSorting = () => { // This is more like a full reset of visualization
    if (animationFrameId.current) {
      clearTimeout(animationFrameId.current);
      animationFrameId.current = null;
    }
    setIsSorting(false); // Crucial to allow array regeneration by resetArray
    setIsPaused(false);
    currentAnimationStep.current = 0;
    animationStepsCache.current = [];
    // Call resetArray, which now also handles clearing timeouts and resetting animation refs
    // and will generate a new array which triggers re-render.
    // It's important that setIsSorting(false) is called before resetArray if resetArray
    // has a condition on isSorting.
    resetArray(); // resetArray will set new array, clear barStates
    console.log('Resetting sort and generating new array...');
  };

  // This useEffect in resetArray handles regeneration if arraySize changes:
  // useEffect(() => { resetArray(); }, [arraySize]);

  const LOCAL_STORAGE_KEY = 'sortingVisualizerSession';

  const saveSession = () => {
    if (isSorting) {
      alert("Please pause or reset the current sorting process before saving.");
      return;
    }
    const sessionData = {
      array,
      algorithm,
      speed,
      arraySize,
      barStates // Save current bar states if needed, or clear them
    };
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(sessionData));
    alert('Session saved!'); // Replace with a more subtle notification later
    console.log('Session saved:', sessionData);
  };

  const loadSession = () => {
    if (isSorting) {
      alert("Please pause or reset the current sorting process before loading.");
      return;
    }
    const savedSession = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (savedSession) {
      const sessionData = JSON.parse(savedSession);
      setArray([...sessionData.array]);
      setAlgorithm(sessionData.algorithm || DEFAULT_ALGORITHM);
      setSpeed(sessionData.speed || DEFAULT_SPEED);
      setArraySize(sessionData.arraySize || DEFAULT_ARRAY_SIZE);
      setBarStates(sessionData.barStates || {}); // Restore bar states

      // Ensure isSorting and isPaused are reset
      setIsSorting(false);
      setIsPaused(false);
      currentAnimationStep.current = 0;
      animationStepsCache.current = [];
      if (animationFrameId.current) {
        clearTimeout(animationFrameId.current);
        animationFrameId.current = null;
      }
      alert('Session loaded!'); // Replace with a more subtle notification
      console.log('Session loaded:', sessionData);
    } else {
      alert('No saved session found.'); // Replace with a more subtle notification
    }
  };

  // Optional: Auto-load on mount - decide if this is desired UX
  // useEffect(() => {
  //   loadSession();
  // }, []); // Empty dependency array means it runs once on mount


  const sectionVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.1,
        duration: 0.4,
        ease: "easeOut"
      }
    })
  };

  return (
    <div className="flex flex-col xl:flex-row gap-6 h-full"> {/* Switch to xl for 3 columns, lg for 2+1 stack */}
      {/* Control Panel */}
      <motion.div
        className="xl:w-1/4 lg:w-full"
        custom={0}
        initial="hidden"
        animate="visible"
        variants={sectionVariants}
      >
        <ControlPanel
          algorithm={algorithm}
          onAlgorithmChange={handleAlgorithmChange}
          speed={speed}
          onSpeedChange={handleSpeedChange}
          arraySize={arraySize}
          onArraySizeChange={handleArraySizeChange}
          onGenerateNewArray={resetArray} // resetArray already generates a new one
          onStart={startSorting}
          onPause={pauseSorting}
          onReset={resetSorting}
          onSaveSession={saveSession} // Pass save function
          onLoadSession={loadSession} // Pass load function
          comparisonCount={comparisonCount} // Pass count
          swapCount={swapCount}           // Pass count
          isSorting={isSorting}
          isPaused={isPaused}
          minArraySize={MIN_ARRAY_SIZE}
          maxArraySize={MAX_ARRAY_SIZE}
          minSpeed={MIN_SPEED}
          maxSpeed={MAX_SPEED}
        />
      </motion.div>

      {/* Main content area: Visualization and Pseudocode */}
      <motion.div
        className="flex-grow xl:w-3/4 flex flex-col lg:flex-row gap-6"
        custom={1}
        initial="hidden"
        animate="visible"
        variants={sectionVariants}
      >
        {/* Visualization Area */}
        <div className="lg:w-2/3 xl:w-3/5 bg-transparent dark:bg-transparent p-0 rounded-lg min-h-[300px] sm:min-h-[350px] md:min-h-[400px] flex flex-col order-1 lg:order-1">
          <div className="flex-grow w-full h-full">
            <BarChart array={array} barStates={barStates} arraySize={arraySize} />
          </div>
        </div>

        {/* Pseudocode Card Area */}
        <div className="lg:w-1/3 xl:w-2/5 order-2 lg:order-2 lg:max-h-[calc(100vh-10rem)] md:min-h-[400px]"> {/* Ensure it has some min height on medium screens too */}
          <PseudocodeCard
            currentAlgorithm={algorithm}
            // currentStepHighlight={/* Pass actual highlight logic later */}
          />
        </div>
      </motion.div>
    </div>
  );
};

export default SortingVisualizer;
