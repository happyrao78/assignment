import React from 'react'
import Authentication from './components/authentication/Auth'
import ExpenseChart from './components/ExpenseChart'
import IncomeChart from './components/IncomeChart'

const App = () => {
  return (
    <>
      <Authentication />
      <div style={{ display: 'flex' }}>
        <div className="expense" style={{width: "50%"}}>
          <ExpenseChart />
        </div>
        <div className="income" style={{width: "50%"}}>
          <IncomeChart />
        </div>
      </div>
    </>
  )
}

export default App