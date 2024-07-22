import React, { useState, useEffect } from 'react'
import axios from 'axios'
import Authentication from './components/authentication/Auth'
import ExpenseChart from './components/ExpenseChart'
import IncomeChart from './components/IncomeChart'
import MonthNavigator from './components/MonthNavigator'
import PlusIcon from './components/PlusIcon'
import PopupForm from './components/PopupForm'
import SearchBar from './components/SearchBar'
import ThemeBtn from './components/ThemeBtn'
import { ThemeProvider } from './components/Context'
import ExpenseCard from './components/ExpenseCard'

const App = ({ selectedMonth }) => {
  console.log('Selected Month:', selectedMonth);

  const rawData = [
    {
      "dateTime": "2024-06-16 06:27:23",
      "amount": "2122.55",
      "type": "Expense",
      "category": "Healthcare",
      "title": "Rent",
      "currency": "EUR",
      "note": "Transaction related to Healthcare"
    },
    {
      "dateTime": "2023-08-07 02:52:46",
      "amount": "2654.26",
      "type": "Expense",
      "category": "Shopping",
      "title": "Dining Out",
      "currency": "JPY",
      "note": "Transaction related to Shopping"
    },
    {
      "dateTime": "2024-01-17 09:30:41",
      "amount": "1565.53",
      "type": "Expense",
      "category": "Travel",
      "title": "Insurance",
      "currency": "JPY",
      "note": "Transaction related to Travel"
    },
    {
      "dateTime": "2023-09-08 14:54:28",
      "amount": "3219.42",
      "type": "Income",
      "category": "Investment",
      "title": "Rental Income",
      "currency": "USD",
      "note": "Transaction related to Investment"
    },
    {
      "dateTime": "2024-03-29 01:16:00",
      "amount": "24.56",
      "type": "Expense",
      "category": "Entertainment",
      "title": "Education",
      "currency": "JPY",
      "note": "Transaction related to Entertainment"
    }
  ]
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [themeMode, setThemeMode] = useState("light");
  const lightTheme = () => {
    setThemeMode('light')
  }
  const darkTheme = () => {
    setThemeMode('dark')
  }

  const [expenses, setExpenses] = useState([]);
  useEffect(() => {
    const filterAndGroupData = () => {
      console.log('Selected Month:', selectedMonth);
      const filteredData = rawData.filter(expense => {
        const expenseDate = new Date(expense.dateTime);
        const expenseMonth = expenseDate.toISOString().slice(0, 7); // YYYY-MM format
        return expenseMonth === selectedMonth;
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

      console.log('Grouped Expenses:', groupedData); // Debugging statement
      setExpenses(groupedData);
    };

    filterAndGroupData();
  }, [selectedMonth]);

  useEffect(() => {
    axios.get("http://localhost:3000/read-csv")
      .then((response) => {
        setData(response.data);
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);



  useEffect(() => {
    document.querySelector('html').classList.remove("light", "dark")
    document.querySelector('html').classList.add(themeMode)
  }, [themeMode])
  const togglePopup = () => {
    setIsPopupOpen(!isPopupOpen);
  };
  const handleAuthStateChanged = (user) => {
    setUser(user)
  }
  return (
    <>
      <Authentication onAuthStateChanged={handleAuthStateChanged} />
      {user && (
        <>
          <ThemeProvider value={{ themeMode, lightTheme, darkTheme }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px', marginRight: '30px' }}>
              <MonthNavigator />


              <ThemeBtn />
            </div>
            <div style={{ display: 'flex', marginTop: "200px" }}>
              <div className="expense" style={{ width: "50%" }}>
                <ExpenseChart />
              </div>
              <div className="income" style={{ width: "50%" }}>
                <IncomeChart />
              </div>
            </div>
            <SearchBar />
            {Object.keys(expenses).length > 0 ? (
              Object.keys(expenses).map(date => (
                <ExpenseCard
                  key={date}
                  date={new Date(date)}
                  totalIncome={expenses[date].totalIncome}
                  totalExpense={expenses[date].totalExpense}
                  expenses={expenses[date].expenses}
                />
              ))
            ) : (
              <p>No expenses to display.</p> // Handle case with no expenses
            )}
            <PlusIcon onClick={togglePopup} />
            {isPopupOpen && <PopupForm togglePopup={togglePopup} />}
          </ThemeProvider>
        </>
      )}
    </>
  )
}

export default App