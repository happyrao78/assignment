import React, { useEffect, useState } from 'react';
import axios from 'axios';

function PopupForm({ togglePopup }) {
  const [formData, setFormData] = useState({
    date: '',
    amount: 2500,
    category: 'Salary',
    title: 'June Month Salary',
    notes: 'This Transaction is regarding the Salary which I received on June 10th 2024.',
    type: 'Income',
  });
  const [categories, setCategories] = useState([]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Make a POST request to add a new entry
      await axios.post('https://backend-production-51d4.up.railway.app/add-entry', formData);
      // Optionally handle success or display a message
      console.log('Entry added successfully');
      togglePopup();
    } catch (error) {
      console.error('Error adding entry:', error);
      // Optionally handle error or display a message
    }
  };

  useEffect(()=>{
    const fetchData = async () =>{
      try {
        const response = await axios.get('https://backend-production-51d4.up.railway.app/read-csv');
        const data = response.data;
        const uniqueCategories  = Array.from(new Set(data.map(item => item.category)))
        
        setCategories(uniqueCategories);
        
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    }
    fetchData();
  },[]);

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50">
      <div className="bg-white p-12 rounded-xl shadow-md w-96 relative">
        <button
          className="absolute top-1 right-2 text-gray-600 hover:text-gray-900 text-2xl bg-red-500 p-2  rounded transition ease-in-out duration-300"
          onClick={togglePopup}
        >
          &times;
        </button>
        <div className="flex justify-between mb-4">
          <button
            className={`px-4 py-2 rounded-xl ${formData.type === 'Income' ? 'bg-blue-500 dark:bg-black dark:transition ease-in-out duration-500 text-white' : 'bg-gray-200 text-gray-700'}`}
            onClick={() => setFormData({ ...formData, type: 'Income' })}
          >
            Income
          </button>
          <button
            className={`px-4 py-2 rounded-xl transition ease-linear duration-300 ${formData.type === 'Expense' ? 'bg-red-700 text-white ' : 'bg-gray-200 text-gray-700'}`}
            onClick={() => setFormData({ ...formData, type: 'Expense' })}
          >
            Expense
          </button>
        </div>
        <h2 className="text-2xl font-bold mb-4">{formData.type.toUpperCase()}</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex items-center">
            <label className="text-gray-700 w-1/3">Date:</label>
            <input 
              type="date" 
              name="date" 
              value={formData.date}
              onChange={handleChange}
              className="p-2 border rounded flex-1"
            />
          </div>
          <div className="flex items-center">
            <label className="text-gray-700 w-1/3">Amount:</label>
            <input 
              type="number" 
              name="amount" 
              value={formData.amount}
              onChange={handleChange}
              className="p-2 border rounded flex-1"
            />
          </div>
          <div className="flex items-center">
            <label className="text-gray-700 w-1/3">Category:</label>
            <select 
              name="category" 
              value={formData.category}
              onChange={handleChange}
              className="p-2 border rounded flex-1"
            >
              <option value="">Select Category</option>
              {categories.map((category,index)=>(
                <option key={index} value={category}>{category}</option>
              ))}
              {/* <option value="Salary">Salary</option>
              <option value="Rent">Rent</option>
              <option value="Groceries">Groceries</option>
              <option value="Utilities">Utilities</option>
              <option value="Entertainment">Entertainment</option>
              <option value="Other">Other</option> */}
            </select>
          </div>
          <div className="flex items-center">
            <label className="text-gray-700 w-1/3">Title:</label>
            <input 
              type="text" 
              name="title" 
              value={formData.title}
              onChange={handleChange}
              className="p-2 border rounded flex-1"
            />
          </div>
          <div className="flex items-center">
            <label className="text-gray-700 w-1/3">Notes:</label>
            <textarea 
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              className="p-2 border rounded flex-1"
            />
          </div>
          <button 
            type="submit" 
            className="w-full p-2 bg-green-500 text-white rounded mt-4 hover:bg-red-500 transition ease-in-out duration-300"
          >
            Save
          </button>
        </form>
      </div>
    </div>
  );
}

export default PopupForm;
