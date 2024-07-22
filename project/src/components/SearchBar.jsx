import React from 'react';

function SearchBar() {
  return (
    <div className="flex items-center bg-white p-4 rounded-md shadow-md space-x-2">
      <div className="flex items-center bg-white rounded-md shadow-sm border border-gray-300 flex-grow">
        <input 
          type="text" 
          placeholder="Search by Title" 
          className="p-2 w-full rounded-l-md focus:outline-none"
        />
        <button className="p-2 bg-white rounded-r-md focus:outline-none">
          <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2H3m12 0a9 9 0 11-2-7.453m2 7.453V19.5a2.5 2.5 0 01-5 0V9.7a2.5 2.5 0 014 0" />
          </svg>
        </button>
      </div>
      <div className="bg-white rounded-md shadow-sm border border-gray-300">
        <select className="p-2 bg-transparent focus:outline-none">
          <option>Type</option>
          <option>Income</option>
          <option>Expense</option>
        </select>
      </div>
      <div className="bg-white rounded-md shadow-sm border border-gray-300">
        <select className="p-2 bg-transparent focus:outline-none">
          <option>Category</option>
          <option>Salary</option>
          <option>Rent</option>
          <option>Groceries</option>
          <option>Utilities</option>
          <option>Entertainment</option>
          <option>Other</option>
        </select>
      </div>
      <div className="bg-white rounded-md shadow-sm border border-gray-300">
        <select className="p-2 bg-transparent focus:outline-none">
          <option>Currency</option>
          <option>USD</option>
          <option>EUR</option>
          <option>GBP</option>
          <option>INR</option>
          <option>JPY</option>
          {/* Add other currency options as needed */}
        </select>
      </div>
    </div>
  );
}

export default SearchBar;
