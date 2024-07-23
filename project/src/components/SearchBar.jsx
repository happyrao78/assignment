// components/SearchBar.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const SearchBar = ({ onSearch }) => {
  const [categories, setCategories] = useState([]);
  const [currencies, setCurrencies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTitle, setSearchTitle] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('http://localhost:3000/read-csv');
        const data = response.data;

        const uniqueCategories = Array.from(new Set(data.map(item => item.category)));
        const uniqueCurrencies = Array.from(new Set(data.map(item => item.currency)));

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

  useEffect(() => {
    onSearch(searchTitle);
  }, [searchTitle, onSearch]);

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
          value={searchTitle}
          onChange={(e) => setSearchTitle(e.target.value)}
        />
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
