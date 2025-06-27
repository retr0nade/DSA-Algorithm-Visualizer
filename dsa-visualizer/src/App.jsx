import { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import SortingVisualizer from './components/SortingVisualizer';
import { motion, AnimatePresence } from 'framer-motion'; // Import for page transitions
import './App.css';

function App() {
  const [darkMode, setDarkMode] = useState(() => {
    const savedMode = localStorage.getItem('darkMode');
    if (savedMode) {
      return JSON.parse(savedMode);
    }
    // Default to system preference if available, else light mode
    return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  const [showVisualizer, setShowVisualizer] = useState(false);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('darkMode', JSON.stringify(true));
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('darkMode', JSON.stringify(false));
    }
  }, [darkMode]);

  const toggleDarkMode = () => {
    setDarkMode(prevMode => !prevMode);
  };

  const navigateToVisualizer = () => setShowVisualizer(true);
  const navigateToHome = () => setShowVisualizer(false);

  const pageVariants = {
    initial: { opacity: 0, x: -50 },
    in: { opacity: 1, x: 0 },
    out: { opacity: 0, x: 50 }
  };

  const pageTransition = {
    type: "tween",
    ease: "anticipate",
    duration: 0.4
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      <Navbar darkMode={darkMode} toggleDarkMode={toggleDarkMode} onLogoClick={navigateToHome} showHomeButton={showVisualizer} />

      <main className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <AnimatePresence mode="wait">
          {!showVisualizer ? (
            <motion.div
              key="landing"
              initial="initial"
              animate="in"
              exit="out"
              variants={pageVariants}
              transition={pageTransition}
              className="text-center flex flex-col items-center justify-center min-h-[calc(100vh-12rem)]" // Adjust min-height to fill space
            >
              <h1 className="text-5xl font-bold text-blue-600 dark:text-blue-400 mb-6">
                DSA Playground – Sorting Visualizer
              </h1>
              <p className="text-xl text-gray-700 dark:text-gray-300 mb-10 max-w-2xl">
                Watch sorting algorithms come to life! Explore Bubble Sort, Merge Sort, Quick Sort, and more with interactive visualizations. Understand how data is sorted step-by-step.
              </p
              <button
                onClick={navigateToVisualizer}
                className="px-8 py-4 bg-blue-500 hover:bg-blue-600 dark:bg-blue-700 dark:hover:bg-blue-600 text-white text-lg font-semibold rounded-lg shadow-xl transition-all transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-blue-500 focus:ring-opacity-50"
              >
                Start Visualizing
              </button>
            </motion.div>
          ) : (
            <motion.div
              key="visualizer"
              initial="initial"
              animate="in"
              exit="out"
              variants={pageVariants}
              transition={pageTransition}
            >
              <SortingVisualizer />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      <Footer />
    </div>
  )
}

export default App
