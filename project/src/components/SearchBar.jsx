import React, { useEffect, useState } from 'react';
import axios from 'axios';

const SearchBar = () => {
  const [categories, setCategories] = useState([]);
  const [currencies, setCurrencies] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch data from the backend
        const response = await axios.get('http://localhost:3000/read-csv');
        const data = response.data;

        // Extract unique categories and currencies
        const uniqueCategories = Array.from(new Set(data.map(item => item.category)));
        const uniqueCurrencies = Array.from(new Set(data.map(item => item.currency)));

        // Update state
        setCategories(uniqueCategories);
        setCurrencies(uniqueCurrencies);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching data:', error);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="flex flex-wrap items-center bg-white p-4 rounded-md justify-center gap-10 shadow-md space-x-2 max-w-full md:max-w-4xl mx-auto">
      <div className="flex items-center bg-white rounded-md shadow-sm border border-gray-300 flex-grow md:flex-grow-0">
        <input 
          type="text" 
          placeholder="Search by Title" 
          className="p-2 w-full rounded-l-md focus:outline-none"
        />
        {/* Optional button (commented out) */}
        {/* <button className="p-2 bg-white rounded-r-md focus:outline-none">
          <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2H3m12 0a9 9 0 11-2-7.453m2 7.453V19.5a2.5 2.5 0 01-5 0V9.7a2.5 2.5 0 014 0" />
          </svg>
        </button> */}
      </div>
      <div className="bg-white rounded-md shadow-sm border border-gray-300 flex-shrink-0 w-full md:w-auto">
        <select className="p-2 bg-transparent focus:outline-none w-full">
          <option>Type</option>
          <option>Income</option>
          <option>Expense</option>
        </select>
      </div>
      <div className="bg-white rounded-md shadow-sm border border-gray-300 flex-shrink-0 w-full md:w-auto">
        <select className="p-2 bg-transparent focus:outline-none w-full">
          <option>Category</option>
          {categories.map((category, index) => (
            <option key={index} value={category}>{category}</option>
          ))}
        </select>
      </div>
      <div className="bg-white rounded-md shadow-sm border border-gray-300 flex-shrink-0 w-full md:w-auto">
        <select className="p-2 bg-transparent focus:outline-none w-full">
          <option>Currency</option>
          {currencies.map((currency, index) => (
            <option key={index} value={currency}>{currency}</option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default SearchBar;
