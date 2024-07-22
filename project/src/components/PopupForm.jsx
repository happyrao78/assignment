import React, { useState } from 'react';
import axios from 'axios';

function PopupForm({ togglePopup }) {
  const [formData, setFormData] = useState({
    date: '',
    amount: 2500,
    category: 'Salary',
    title: 'June Month Salary',
    notes: 'This Transaction is regarding the Salary which I received on June 10th 2024.',
    type: 'income',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Make a POST request to add a new entry
      await axios.post('http://localhost:3000/add-entry', formData);
      // Optionally handle success or display a message
      console.log('Entry added successfully');
      togglePopup();
    } catch (error) {
      console.error('Error adding entry:', error);
      // Optionally handle error or display a message
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50">
      <div className="bg-white p-6 rounded shadow-md w-96 relative">
        <button
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
          onClick={togglePopup}
        >
          &times;
        </button>
        <div className="flex justify-between mb-4">
          <button
            className={`px-4 py-2 ${formData.type === 'income' ? 'bg-blue-500 dark:bg-black dark:transition ease-in-out duration-500 text-white' : 'bg-gray-200 text-gray-700'}`}
            onClick={() => setFormData({ ...formData, type: 'income' })}
          >
            Income
          </button>
          <button
            className={`px-4 py-2 ${formData.type === 'expense' ? 'bg-red-500 text-white' : 'bg-gray-200 text-gray-700'}`}
            onClick={() => setFormData({ ...formData, type: 'expense' })}
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
              <option value="Salary">Salary</option>
              <option value="Rent">Rent</option>
              <option value="Groceries">Groceries</option>
              <option value="Utilities">Utilities</option>
              <option value="Entertainment">Entertainment</option>
              <option value="Other">Other</option>
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
            className="w-full p-2 bg-green-500 text-white rounded mt-4"
          >
            Save
          </button>
        </form>
      </div>
    </div>
  );
}

export default PopupForm;
