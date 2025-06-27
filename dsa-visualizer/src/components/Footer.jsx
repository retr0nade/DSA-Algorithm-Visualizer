import React from 'react';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  return (
    <footer className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 mt-auto">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <p className="text-center text-sm text-gray-600 dark:text-gray-400">
          © {currentYear} DSA Playground. All Rights Reserved.
        </p>
        {/* You can add more links or information here if needed */}
      </div>
    </footer>
  );
};

export default Footer;
