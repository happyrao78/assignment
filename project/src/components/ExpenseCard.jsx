import React, { useState } from 'react';
import axios from 'axios';
import { MdDelete, MdEdit } from "react-icons/md";
import EditExpensePopup from './EditExpensePopup'; // Import the EditExpensePopup component

const ExpenseCard = ({ date, totalIncome, totalExpense, expenses, onDelete, onEdit }) => {
  const daysOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  const dayOfWeek = daysOfWeek[date.getDay()];

  const [editPopupOpen, setEditPopupOpen] = useState(false);
  const [deletePopupOpen, setDeletePopupOpen] = useState(false);
  const [selectedExpense, setSelectedExpense] = useState(null);

  const handleDelete = (dateTime) => {
    axios.delete('http://localhost:3000/delete-entry', { data: { dateTime } })
      .then(response => {
        console.log('Deleted successfully:', response.data);
        onDelete(dateTime); // Call the onDelete callback to update the UI
        setDeletePopupOpen(false); // Close the delete confirmation popup
      })
      .catch(error => {
        console.error('Error deleting entry:', error);
      });
  };

  const handleEdit = (expense) => {
    setSelectedExpense(expense);
    setEditPopupOpen(true);
  };

  const closeEditPopup = () => {
    setEditPopupOpen(false);
    setSelectedExpense(null);
  };

  const openDeletePopup = (expense) => {
    setSelectedExpense(expense);
    setDeletePopupOpen(true);
  };

  const closeDeletePopup = () => {
    setDeletePopupOpen(false);
    setSelectedExpense(null);
  };

  return (
    <div className="max-w-xs sm:max-w-sm sm-custom:max-w-md md:max-w-lg lg:max-w-xl xl:max-w-2xl mx-auto bg-white dark:bg-blue-900 dark:transition ease-linear duration-500 rounded-xl shadow-md overflow-hidden my-4">
      <div className="">
        <div className="p-4">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center space-x-2">
              <div className="text-2xl font-bold text-black dark:text-white dark:transition ease-linear duration-500 ">{date.getDate()}</div>
              <div className="text-sm text-gray-500 dark:text-gray-200 dark:transition ease-linear duration-500">{dayOfWeek}</div>
            </div>
          </div>
          <hr className='pb-1' />
          {expenses.map((expense, index) => (
            <div key={index} className="mb-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <span className={`bg-${expense.categoryColor}-100 text-${expense.categoryColor}-800 text-xs font-semibold px-2 py-0.5 rounded dark:text-green-200 dark:transition ease-linear duration-500`}>
                    {expense.category}
                  </span>
                  <span className="text-sm font-medium dark:text-white dark:transition ease-linear duration-500">{expense.title}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-red-500 font-semibold">₹ {expense.amount}</span>
                  <button className="text-blue-700 hover:text-blue-500" onClick={() => handleEdit(expense)}>
                    <MdEdit />
                  </button>
                  <button className="text-red-700 hover:text-red-500" onClick={() => openDeletePopup(expense)}>
                    <MdDelete />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      {editPopupOpen && selectedExpense && (
        <EditExpensePopup 
          expense={selectedExpense} 
          onClose={closeEditPopup} 
          onEdit={onEdit}
        />
      )}
      {deletePopupOpen && selectedExpense && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
          <div className="bg-white dark:bg-blue-900 p-6 rounded-lg shadow-lg">
            <h2 className="text-lg font-semibold dark:text-white">Are you sure you want to delete this transaction?</h2>
            <div className="mt-4 flex justify-end space-x-2">
              <button className="bg-red-500 text-white px-4 py-2 rounded-lg" onClick={() => handleDelete(selectedExpense.dateTime)}>
                Yes
              </button>
              <button className="bg-gray-500 text-white px-4 py-2 rounded-lg" onClick={closeDeletePopup}>
                No
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ExpenseCard;
