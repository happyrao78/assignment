import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, ArcElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, ArcElement, Title, Tooltip, Legend);

const IncomeChart = () => {
  const [chartData, setChartData] = useState({});
  const [loading, setLoading] = useState(true);
  const [totalIncome, setTotalIncome] = useState(0);

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

        const incomeData = data.filter(item => item.type === 'Income');

        const aggregatedIncomeData = incomeData.reduce((acc, item) => {
          const category = item.category;
          const amount = parseFloat(item.amount);

          if (acc[category]) {
            acc[category] += amount;
          } else {
            acc[category] = amount;
          }
          return acc;
        }, {});

        const total = Object.values(aggregatedIncomeData).reduce((sum, value) => sum + value, 0);
        setTotalIncome(total);

        const labels = Object.keys(aggregatedIncomeData);
        const values = Object.values(aggregatedIncomeData);

        console.log("Processed labels:", labels);
        console.log("Processed values:", values);

        const colors = labels.map((_, index) => `hsl(${index * 360 / labels.length}, 70%, 70%)`);

        setChartData({
          labels: labels,
          datasets: [
            {
              label: 'Income',
              data: values,
              backgroundColor: colors,
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
      {/* <h2 className='text-3xl font-bold'>Income</h2> */}
      
      <div style={{ width: '100%', height: '300px' }} className='mb-10'>
        <Pie 
          data={chartData} 
          options={{
            maintainAspectRatio: false,
          }} 
        />
      </div>
      <div className="card bg-green-200 flex items-center  justify-center mx-auto" style={{width:'450px', marginBottom: '20px', padding: '20px', border: '1px solid #ccc', borderRadius: '8px', boxShadow: '0 2px 5px rgba(0, 0, 0, 0.1)' }}>
        <h3 className='text-2xl text-green-800 font-bold '>INCOME: ${totalIncome.toFixed(2)}</h3>
        {/* <p className='text-xl'>${totalIncome.toFixed(2)}</p> */}
      </div>
    </div>
  );
};

export default IncomeChart;
