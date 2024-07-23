import React from 'react';
import axios from 'axios';
import { MdDelete } from "react-icons/md";

const ExpenseCard = ({ date, totalIncome, totalExpense, expenses, onDelete }) => {
  // Define the days of the week
  const daysOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

  // Calculate the day of the week from the date
  const dayOfWeek = daysOfWeek[date.getDay()];

  const handleDelete = (dateTime) => {
    axios.delete('http://localhost:3000/delete-entry', { data: { dateTime } })
      .then(response => {
        console.log('Deleted successfully:', response.data);
        onDelete(dateTime); // Call the onDelete callback to update the UI
      })
      .catch(error => {
        console.error('Error deleting entry:', error);
      });
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
            <div className="flex items-center space-x-4">
              {/* <div className="text-green-500">{totalIncome}</div> */}
              {/* <div className="text-red-500">{totalExpense}</div> */}
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
                  <span className="text-red-500 font-semibold">{expense.amount}</span>
                  <button className="text-red-700 hover:text-red-500" onClick={() => handleDelete(expense.dateTime)}>
                    <MdDelete />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ExpenseCard;
