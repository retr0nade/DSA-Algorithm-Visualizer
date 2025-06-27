import React from 'react';
import { Moon, Sun, Home, LayoutGrid } from 'lucide-react';

const Navbar = ({ darkMode, toggleDarkMode, onLogoClick, showHomeButton }) => {
  return (
    <nav className="bg-white dark:bg-gray-800 shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <button onClick={onLogoClick} className="flex-shrink-0 focus:outline-none">
              {/* You can replace this with a logo later */}
              <span className="text-2xl font-bold text-blue-600 dark:text-blue-400 hover:opacity-80 transition-opacity">
                DSA Playground
              </span>
            </button>
          </div>
          <div className="flex items-center space-x-2 sm:space-x-3">
            {showHomeButton ? (
                 <button
                    onClick={onLogoClick} // onLogoClick navigates to Home
                    className="p-2 rounded-md text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500 flex items-center"
                    title="Go to Home Page"
                 >
                    <Home size={20} />
                    <span className="ml-2 hidden sm:inline">Home</span>
                 </button>
            ) : (
                // This button would navigate to visualizer, but App.jsx handles it from landing page.
                // So, this space could be for other links or kept empty if on landing page.
                // For now, let's not show a "Visualizer" button here if it's implicitly the main CTA on landing.
                null
            )}
            <button
              onClick={toggleDarkMode}
              className="p-2 rounded-md text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
              aria-label={darkMode ? 'Activate light mode' : 'Activate dark mode'}
              title={darkMode ? 'Activate light mode' : 'Activate dark mode'}
            >
              {darkMode ? <Sun size={24} /> : <Moon size={24} />}
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
