import React, { useState } from 'react';

const MonthNavigator = () => {
  const [monthIndex, setMonthIndex] = useState(0);

  const months = [
    'January 2023', 'February 2023', 'March 2023', 'April 2023', 'May 2023', 'June 2023', 
    'July 2023', 'August 2023', 'September 2023', 'October 2023', 'November 2023', 'December 2023',
    'January 2024', 'February 2024', 'March 2024', 'April 2024', 'May 2024', 'June 2024', 
    'July 2024', 'August 2024', 'September 2024', 'October 2024', 'November 2024', 'December 2024'
  ];

  const handlePrev = () => {
    setMonthIndex((prevIndex) => Math.max(prevIndex - 1, 0));
  };

  const handleNext = () => {
    setMonthIndex((prevIndex) => Math.min(prevIndex + 1, months.length - 1));
  };

  return (
    <div className="flex justify-center w-1/2 items-center p-6 m-10 mt-10 mx-auto bg-gray-100 rounded-lg shadow-md">
      <button 
        onClick={handlePrev} 
        disabled={monthIndex === 0}
        className="bg-blue-500 text-white px-4 py-2 rounded mr-10 disabled:bg-gray-300"
      >
        {'<'}
      </button>
      <span className="text-xl font-bold">{months[monthIndex]}</span>
      <button 
        onClick={handleNext} 
        disabled={monthIndex === months.length - 1}
        className="bg-blue-500 text-white px-4 py-2 rounded ml-10 disabled:bg-gray-300"
      >
        {'>'}
      </button>
    </div>
  );
};

export default MonthNavigator;
