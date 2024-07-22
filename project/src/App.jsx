import React, { useState } from 'react'
import Authentication from './components/authentication/Auth'
import ExpenseChart from './components/ExpenseChart'
import IncomeChart from './components/IncomeChart'
import MonthNavigator from './components/MonthNavigator'
import PlusIcon from './components/PlusIcon'
import PopupForm from './components/PopupForm'
import SearchBar from './components/SearchBar'

const App = () => {
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [user,setUser]= useState(null);
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
        <MonthNavigator />
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
      </>
      )}
    </>
  )
}

export default App