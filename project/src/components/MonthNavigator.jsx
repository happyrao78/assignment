import React, { useState, useEffect } from 'react';

const MonthNavigator = ({ onMonthChange }) => {
  const [monthIndex, setMonthIndex] = useState(0);

  const months = [
    'January 2023', 'February 2023', 'March 2023', 'April 2023', 'May 2023', 'June 2023', 
    'July 2023', 'August 2023', 'September 2023', 'October 2023', 'November 2023', 'December 2023',
    'January 2024', 'February 2024', 'March 2024', 'April 2024', 'May 2024', 'June 2024', 
    'July 2024', 'August 2024', 'September 2024', 'October 2024', 'November 2024', 'December 2024'
  ];

  const handlePrev = () => {
    setMonthIndex(prevIndex => Math.max(prevIndex - 1, 0));
  };

  const handleNext = () => {
    setMonthIndex(prevIndex => Math.min(prevIndex + 1, months.length - 1));
  };

  useEffect(() => {
    if (onMonthChange) {
      onMonthChange(months[monthIndex]);
    }
  }, [monthIndex, onMonthChange, months]);

  return (
    <div className="flex items-center justify-center p-4 mx-auto dark:bg-black dark:transition ease-in-out duration-500 bg-gray-100 rounded-lg shadow-md mt-10 max-w-full sm:max-w-md md:max-w-lg lg:max-w-4xl">
      <button 
        onClick={handlePrev} 
        disabled={monthIndex === 0}
        className="bg-blue-500 text-white px-4 py-2 rounded-lg disabled:bg-gray-300 transition-colors duration-300 hover:bg-blue-600"
      >
        {'<'}
      </button>
      <span className="text-xl font-bold mx-4 dark:text-white">{months[monthIndex]}</span>
      <button 
        onClick={handleNext} 
        disabled={monthIndex === months.length - 1}
        className="bg-blue-500 text-white px-4 py-2 rounded-lg disabled:bg-gray-300 transition-colors duration-300 hover:bg-blue-600"
      >
        {'>'}
      </button>
    </div>
  );
};

export default MonthNavigator;
