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
  const [incomes, setIncomes] = useState({});
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
    axios.get("https://backend-production-51d4.up.railway.app/read-csv")
      .then(response => setData(response.data))
      .catch(error => console.error('Error fetching data:', error))
      .finally(() => setLoading(false));
  }, []);

  // Filter and group data
  useEffect(() => {
    const filterAndGroupData = () => {
      const filteredData = data.filter(item => {
        const itemDate = new Date(item.dateTime);
        const month = itemDate.toLocaleString('default', { month: 'long' }) + ' ' + itemDate.getFullYear();
        return month === selectedMonth;
      }).filter(item => {
        // Filter by type
        if (selectedType && item.type !== selectedType) return false;
        // Filter by category
        if (selectedCategory && item.category !== selectedCategory) return false;
        // Filter by search query
        if (searchQuery && !item.title.toLowerCase().includes(searchQuery.toLowerCase())) return false;
        return true;
      });
    
      const convertedData = filteredData.map(item => {
        const { currency, amount } = item;
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
    
        return { ...item, amount: amountInINR, currency: 'INR' };
      });
    
      console.log("Converted Data:", convertedData);
    
      const groupedData = convertedData.reduce((acc, item) => {
        const date = new Date(item.dateTime).toDateString();
        if (!acc[date]) {
          acc[date] = { items: [], totalIncome: 0, totalExpense: 0 };
        }
        acc[date].items.push(item);
      
        if (item.type === 'Income') {
          acc[date].totalIncome += parseFloat(item.amount);
        } else {
          acc[date].totalExpense += parseFloat(item.amount);
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
      setIncomes(sortedExpenses); // Assuming incomes are also part of the same structure
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
      updatedExpenses[date].items = updatedExpenses[date].items.filter(item => item.dateTime !== dateTime);
      if (updatedExpenses[date].items.length === 0) {
        delete updatedExpenses[date];
      }
    });
    setExpenses(updatedExpenses);
    setIncomes(updatedExpenses); // Assuming incomes are also part of the same structure
  };

  const handleEdit = (updatedItem) => {
    const updatedExpenses = { ...expenses };
    const date = new Date(updatedItem.dateTime).toDateString();
    if (updatedExpenses[date]) {
      updatedExpenses[date].items = updatedExpenses[date].items.map(item =>
        item.dateTime === updatedItem.dateTime ? updatedItem : item
      );
      updatedExpenses[date].totalIncome = updatedExpenses[date].items.reduce((acc, item) => item.amount > 0 ? acc + parseFloat(item.amount) : acc, 0);
      updatedExpenses[date].totalExpense = updatedExpenses[date].items.reduce((acc, item) => item.amount < 0 ? acc + Math.abs(parseFloat(item.amount)) : acc, 0);
    }
    setExpenses(updatedExpenses);
    setIncomes(updatedExpenses); // Assuming incomes are also part of the same structure
  };

  const openEditPopup = (item) => {
    setSelectedExpense(item);
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
                <ExpenseChart selectedMonth={selectedMonth} conversionRates={conversionRates} expenses={expenses}/>
              </div>
              <div className="md:w-full">
                <IncomeChart selectedMonth={selectedMonth} conversionRates={conversionRates} incomes={incomes} />
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
                  expenses={expenses[date].items}
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
