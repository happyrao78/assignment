import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Line, Bar, Pie, Doughnut, Radar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, PointElement, LineElement, Title, Tooltip, Legend, ArcElement } from 'chart.js';


ChartJS.register(CategoryScale, LinearScale, BarElement, PointElement, ArcElement, LineElement, Title, Tooltip, Legend);

const ExpenseChart = () => {
  const [chartData, setChartData] = useState({});
  const [loading, setLoading] = useState(true);
  const [totalExpense, setTotalExpense] = useState(0);


  useEffect(() => {
    axios.get('http://localhost:3000/read-csv/')
      .then(response => {
        const data = response.data;

        console.log("Fetched data:", data);

        if (!Array.isArray(data)) {
          console.error('Data format is incorrect:', data);
          setLoading(false);
          return;
        }

        const expenseData = data.filter(item => item.type === 'Expense');

        const aggregatedExpenseData = expenseData.reduce((acc, item) => {
          const category = item.category;
          const amount = parseFloat(item.amount);

          if (acc[category]) {
            acc[category] += amount;
          } else {
            acc[category] = amount;
          }
          return acc;
        }, {});

        const aggregatedData = data.reduce((acc, item) => {
          const label = item.type;
          const value = parseFloat(item.amount);

          if (acc[label]) {
            acc[label] += value;
          } else {
            acc[label] = value;
          }
          return acc;
        }, {});

        const total = Object.values(aggregatedExpenseData).reduce((sum, value) => sum + value, 0);
        setTotalExpense(total);

        // const labels = data.map(item => item.type);
        // const labels = ["Expenses", "Income"];
        // const values = data.map(item => item.amount);
        const labels = Object.keys(aggregatedExpenseData);
        const values = Object.values(aggregatedExpenseData);

        console.log("Processed labels:", labels);
        console.log("Processed values:", values);

        const colors = labels.map((_, index) => `hsl(${index * 360 / labels.length}, 70%, 70%)`);

        setChartData({
          labels: labels,
          datasets: [
            {
              label: 'Your Data Label',
              data: values,
              // backgroundColor: 'rgba(75,192,192,0.4)',
              backgroundColor: colors,
              // borderColor: 'rgba(75,192,192,1)',
              borderColor: colors.map(color => color.replace('0.4', '1')),
              borderWidth: 1,
              fill: false,
              
              
            },
          ],
        });

        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching data:', error);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      {/* <h2>Expense Chart</h2> */}
      
      <div style={{ width: '100%', height: '300px' }} className='mb-10 mt-0'>
        <Pie 
          data={chartData} 
          options={{
            maintainAspectRatio: false,
            // scales: {
            //   x: { 
            //     grid:{ 
            //       display: false
            //     },
            //     beginAtZero: true 
            //   },
            //   y: { 
            //     grid:{
            //       display:false
            //     },
            //     beginAtZero: true
            //   }
            // }
          }} 
        />
      </div>
      <div className="card bg-red-200 flex items-center  justify-center mx-auto" style={{width:'450px', marginBottom: '20px', padding: '20px', border: '1px solid #ccc', borderRadius: '8px', boxShadow: '0 2px 5px rgba(0, 0, 0, 0.1)' }}>
        <h3 className='text-2xl text-red-800 font-bold '>EXPENSE: ${totalExpense.toFixed(2)}</h3>
        {/* <p className='text-xl'>${totalIncome.toFixed(2)}</p> */}
      </div>
    </div>
  );
};

export default ExpenseChart;
