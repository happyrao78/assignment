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
  const [selectedType, setSelectedType] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedCurrency, setSelectedCurrency] = useState('');

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
      }).filter(expense => {
        // Filter by type
        if (selectedType && expense.type !== selectedType) return false;
        // Filter by category
        if (selectedCategory && expense.category !== selectedCategory) return false;
        // Filter by currency
        if (selectedCurrency && expense.currency !== selectedCurrency) return false;
        // Filter by search query
        if (searchQuery && !expense.title.toLowerCase().includes(searchQuery.toLowerCase())) return false;
        return true;
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

      const sortedExpenses = Object.keys(groupedData)
        .sort((a, b) => new Date(b) - new Date(a))
        .reduce((acc, date) => {
          acc[date] = groupedData[date];
          return acc;
        }, {});

      setExpenses(sortedExpenses);
    };

    filterAndGroupData();
  }, [data, selectedMonth, searchQuery, selectedType, selectedCategory, selectedCurrency]);

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

  const handleTypeChange = (type) => {
    setSelectedType(type);
  };

  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
  };

  const handleCurrencyChange = (currency) => {
    setSelectedCurrency(currency);
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
    <div className='dark:bg-blue-200 dark:transition ease-linear duration-500'>
      <Authentication onAuthStateChanged={handleAuthStateChanged} />
      {user && (
        <>
          <ThemeProvider value={{ themeMode, lightTheme, darkTheme }}>
            <div className="flex justify-between items-center mt-5 md:ml-10 ">
              <ThemeBtn />
            </div>
            <MonthNavigator onMonthChange={handleMonthChange} />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4">
              <div className="md:w-full">
                <ExpenseChart selectedMonth={selectedMonth} />
              </div>
              <div className="md:w-full">
                <IncomeChart selectedMonth={selectedMonth} />
              </div>
            </div>
            <SearchBar 
              onSearch={handleSearch} 
              onTypeChange={handleTypeChange} 
              onCategoryChange={handleCategoryChange}
              onCurrencyChange={handleCurrencyChange} 
            />
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
    </div>
  );
}

export default App;
