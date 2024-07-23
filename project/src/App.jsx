// App.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Authentication from './components/authentication/Auth';
import ExpenseChart from './components/ExpenseChart';
import IncomeChart from './components/IncomeChart';
import MonthNavigator from './components/MonthNavigator';
import PlusIcon from './components/PlusIcon';
import PopupForm from './components/PopupForm';
import SearchBar from './components/SearchBar';
import ThemeBtn from './components/ThemeBtn';
import { ThemeProvider } from './components/Context';
import ExpenseCard from './components/ExpenseCard';

const App = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [themeMode, setThemeMode] = useState("light");
  const [selectedMonth, setSelectedMonth] = useState('January 2023');
  const [expenses, setExpenses] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');

  const lightTheme = () => setThemeMode('light');
  const darkTheme = () => setThemeMode('dark');

  useEffect(() => {
    axios.get("http://localhost:3000/read-csv")
      .then(response => setData(response.data))
      .catch(error => console.error('Error fetching data:', error))
      .finally(() => setLoading(false));
  }, []);
  
  useEffect(() => {
    const filterAndGroupData = () => {
      const filteredData = data.filter(expense => {
        const expenseDate = new Date(expense.dateTime);
        const month = expenseDate.toLocaleString('default', { month: 'long' }) + ' ' + expenseDate.getFullYear();
        return month === selectedMonth;
      });

      const groupedData = filteredData.reduce((acc, expense) => {
        const date = new Date(expense.dateTime).toDateString();
        if (!acc[date]) {
          acc[date] = { expenses: [], totalIncome: 0, totalExpense: 0 };
        }
        acc[date].expenses.push(expense);
        if (expense.amount > 0) {
          acc[date].totalIncome += parseFloat(expense.amount);
        } else {
          acc[date].totalExpense += Math.abs(parseFloat(expense.amount));
        }
        return acc;
      }, {});

      // Sort and filter based on search query
      const sortedExpenses = Object.keys(groupedData)
        .sort((a, b) => new Date(b) - new Date(a))
        .reduce((acc, date) => {
          const dateExpenses = groupedData[date].expenses.filter(expense =>
            expense.title.toLowerCase().includes(searchQuery.toLowerCase())
          );
          if (dateExpenses.length > 0) {
            acc[date] = {
              ...groupedData[date],
              expenses: dateExpenses
            };
          }
          return acc;
        }, {});

      setExpenses(sortedExpenses);
    };

    filterAndGroupData();
  }, [data, selectedMonth, searchQuery]);

  useEffect(() => {
    document.querySelector('html').classList.remove("light", "dark");
    document.querySelector('html').classList.add(themeMode);
  }, [themeMode]);

  const togglePopup = () => setIsPopupOpen(!isPopupOpen);
  const handleAuthStateChanged = (user) => setUser(user);
  const handleMonthChange = (month) => setSelectedMonth(month);

  const handleSearch = (query) => {
    setSearchQuery(query);
  };

  const handleDelete = (dateTime) => {
    const updatedExpenses = { ...expenses };
    Object.keys(updatedExpenses).forEach(date => {
      updatedExpenses[date].expenses = updatedExpenses[date].expenses.filter(expense => expense.dateTime !== dateTime);
      if (updatedExpenses[date].expenses.length === 0) {
        delete updatedExpenses[date];
      }
    });
    setExpenses(updatedExpenses);
  };

  return (
    <>
      <Authentication onAuthStateChanged={handleAuthStateChanged} />
      {user && (
        <>
          <ThemeProvider value={{ themeMode, lightTheme, darkTheme }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px', marginRight: '30px', marginTop: '0px' }}>
              <ThemeBtn />
            </div>
            <MonthNavigator onMonthChange={handleMonthChange} />
            <div style={{ display: 'flex', marginTop: "0px" }} className='grid grid-flow-col'>
              <div className="expense" style={{ width: "50%" }}>
                <ExpenseChart selectedMonth={selectedMonth} />
              </div>
              <div className="income" style={{ width: "50%" }}>
                <IncomeChart selectedMonth={selectedMonth} />
              </div>
            </div>
            <SearchBar onSearch={handleSearch} />
            {Object.keys(expenses).length > 0 ? (
              Object.keys(expenses).map(date => (
                <ExpenseCard
                  key={date}
                  date={new Date(date)}
                  totalIncome={expenses[date].totalIncome}
                  totalExpense={expenses[date].totalExpense}
                  expenses={expenses[date].expenses}
                  onDelete={handleDelete}
                />
              ))
            ) : (
              <div className='flex m-10 mx-auto items-center justify-center text-3xl font-bold'>No transactions to Display</div>
            )}
            <PlusIcon onClick={togglePopup} />
            {isPopupOpen && <PopupForm togglePopup={togglePopup} />}
          </ThemeProvider>
        </>
      )}
    </>
  );
}

export default App;
