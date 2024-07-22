import React, { useState,useEffect } from 'react'
import Authentication from './components/authentication/Auth'
import ExpenseChart from './components/ExpenseChart'
import IncomeChart from './components/IncomeChart'
import MonthNavigator from './components/MonthNavigator'
import PlusIcon from './components/PlusIcon'
import PopupForm from './components/PopupForm'
import SearchBar from './components/SearchBar'
import ThemeBtn from './components/ThemeBtn'
import { ThemeProvider } from './components/Context'

const App = () => {
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [user,setUser]= useState(null);
  const [themeMode,setThemeMode]= useState("light");
  const lightTheme = ()=>{
    setThemeMode('light')
  }
  const darkTheme= ()=>{
    setThemeMode('dark')
  }
  useEffect(()=>{
    document.querySelector('html').classList.remove("light","dark")
    document.querySelector('html').classList.add(themeMode)
  },[themeMode])
  const togglePopup = () => {
    setIsPopupOpen(!isPopupOpen);
  };
  const handleAuthStateChanged = (user) => {
    setUser(user)
  }
  return (
    <>
      <Authentication  onAuthStateChanged={handleAuthStateChanged}/>
      {user &&(
        <>
        <ThemeProvider value={{themeMode, lightTheme,  darkTheme}}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px',marginRight:'30px',marginTop:'30px' }}>
        <MonthNavigator />
        
        
        <ThemeBtn />
        </div>
      <div style={{ display: 'flex',marginTop:"200px"}}>
        <div className="expense" style={{width: "50%"}}>
          <ExpenseChart />
        </div>
        <div className="income" style={{width: "50%"}}>
          <IncomeChart />
        </div>
      </div>
      <SearchBar />
      <PlusIcon onClick={togglePopup} />
      {isPopupOpen && <PopupForm togglePopup={togglePopup} />}
      </ThemeProvider>
      </>
      )}
    </>
  )
}

export default App