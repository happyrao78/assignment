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
import EditExpensePopup from './components/EditExpensePopup';

const App = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [themeMode, setThemeMode] = useState("light");
  const [selectedMonth, setSelectedMonth] = useState('January 2023');
  const [expenses, setExpenses] = useState({});
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [editPopupOpen, setEditPopupOpen] = useState(false);
  const [selectedExpense, setSelectedExpense] = useState(null);
  const [conversionRates, setConversionRates] = useState({});

  const lightTheme = () => setThemeMode('light');
  const darkTheme = () => setThemeMode('dark');

  // Fetch conversion rates when component mounts
  useEffect(() => {
    axios.get('https://api.exchangerate-api.com/v4/latest/INR')
      .then(response => {
        console.log("Fetched conversion rates:", response.data.rates);
        setConversionRates(response.data.rates);
      })
      .catch(error => console.error('Error fetching conversion rates:', error));
  }, []);
  
  // Fetch CSV data when component mounts
  useEffect(() => {
    axios.get("http://localhost:3000/read-csv")
      .then(response => setData(response.data))
      .catch(error => console.error('Error fetching data:', error))
      .finally(() => setLoading(false));
  }, []);

  // Filter and group data
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
        // Filter by search query
        if (searchQuery && !expense.title.toLowerCase().includes(searchQuery.toLowerCase())) return false;
        return true;
      });
    
      const convertedData = filteredData.map(expense => {
        const { currency, amount } = expense;
        let amountInINR;
    
        console.log(`Currency: ${currency}, Amount: ${amount}`);
    
        if (currency === 'INR') {
          amountInINR = parseFloat(amount);
        } else {
          const rate = conversionRates[currency];
          console.log(`Rate for ${currency}: ${rate}`);
          if (rate) {
            amountInINR = (parseFloat(amount) * (1 / rate)).toFixed(2); // Convert to INR
          } else {
            console.warn(`Conversion rate for ${currency} not found.`);
            amountInINR = parseFloat(amount); // Fallback
          }
        }
    
        console.log(`Converted Amount in INR: ${amountInINR}`);
    
        return { ...expense, amount: amountInINR, currency: 'INR' };
      });
    
      console.log("Converted Data:", convertedData);
    
      const groupedData = convertedData.reduce((acc, expense) => {
        const date = new Date(expense.dateTime).toDateString();
        if (!acc[date]) {
          acc[date] = { expenses: [], totalIncome: 0, totalExpense: 0 };
        }
        acc[date].expenses.push(expense);
      
        if (expense.type === 'Income') {
          acc[date].totalIncome += parseFloat(expense.amount);
        } else {
          acc[date].totalExpense += parseFloat(expense.amount);
        }
      
        return acc;
      }, {});
    
      console.log("Grouped Data:", groupedData);
    
      const sortedExpenses = Object.keys(groupedData)
        .sort((a, b) => new Date(b) - new Date(a))
        .reduce((acc, date) => {
          acc[date] = groupedData[date];
          return acc;
        }, {});
    
      setExpenses(sortedExpenses);
    };
    
    filterAndGroupData();
  }, [data, selectedMonth, searchQuery, selectedType, selectedCategory, conversionRates]);

  // Handle theme changes
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

  const handleEdit = (updatedExpense) => {
    const updatedExpenses = { ...expenses };
    const date = new Date(updatedExpense.dateTime).toDateString();
    if (updatedExpenses[date]) {
      updatedExpenses[date].expenses = updatedExpenses[date].expenses.map(exp =>
        exp.dateTime === updatedExpense.dateTime ? updatedExpense : exp
      );
      updatedExpenses[date].totalIncome = updatedExpenses[date].expenses.reduce((acc, exp) => exp.amount > 0 ? acc + parseFloat(exp.amount) : acc, 0);
      updatedExpenses[date].totalExpense = updatedExpenses[date].expenses.reduce((acc, exp) => exp.amount < 0 ? acc + Math.abs(parseFloat(exp.amount)) : acc, 0);
    }
    setExpenses(updatedExpenses);
  };

  const openEditPopup = (expense) => {
    setSelectedExpense(expense);
    setEditPopupOpen(true);
  };

  const closeEditPopup = () => {
    setEditPopupOpen(false);
    setSelectedExpense(null);
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
                <ExpenseChart selectedMonth={selectedMonth} conversionRates={conversionRates} />
              </div>
              <div className="md:w-full">
                <IncomeChart selectedMonth={selectedMonth} conversionRates={conversionRates} />
              </div>
            </div>
            <SearchBar 
              onSearch={handleSearch} 
              onTypeChange={handleTypeChange} 
              onCategoryChange={handleCategoryChange}
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
                  onEdit={openEditPopup} // Pass the openEditPopup function
                />
              ))
            ) : (
              <div className='flex m-10 mx-auto items-center justify-center text-3xl font-bold'>No transactions to Display</div>
            )}
            <PlusIcon onClick={togglePopup} />
            {isPopupOpen && <PopupForm togglePopup={togglePopup} />}
            {editPopupOpen && selectedExpense && (
              <EditExpensePopup 
                expense={selectedExpense} 
                onClose={closeEditPopup} 
                onEdit={handleEdit}
              />
            )}
          </ThemeProvider>
        </>
      )}
    </div>
  );
}

export default App;
