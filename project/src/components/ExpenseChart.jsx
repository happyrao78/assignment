import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Title, Tooltip, Legend } from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import moment from 'moment';

ChartJS.register(ArcElement, Title, Tooltip, Legend, ChartDataLabels);

const ExpenseChart = ({ selectedMonth }) => {
  const [chartData, setChartData] = useState({});
  const [loading, setLoading] = useState(true);
  const [totalExpense, setTotalExpense] = useState(0);

  useEffect(() => {
    axios.get('http://localhost:3000/read-csv/')
      .then(response => {
        const data = response.data;

        if (!Array.isArray(data)) {
          console.error('Data format is incorrect:', data);
          setLoading(false);
          return;
        }

        const formattedSelectedMonth = moment(selectedMonth, 'MMMM YYYY').format('YYYY-MM');
        const expenseData = data.filter(item => {
          const itemMonth = moment(item.dateTime).format('YYYY-MM');
          return item.type === 'Expense' && itemMonth === formattedSelectedMonth;
        });

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

        const total = Object.values(aggregatedExpenseData).reduce((sum, value) => sum + value, 0);
        setTotalExpense(total);

        const labels = Object.keys(aggregatedExpenseData);
        const values = Object.values(aggregatedExpenseData);

        console.log('Processed labels:', labels);
        console.log('Processed values:', values);

        const colors = labels.map((_, index) => `hsl(${index * 360 / labels.length}, 70%, 70%)`);

        setChartData({
          labels: labels,
          datasets: [
            {
              label: 'Expense',
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
  }, [selectedMonth]);

  if (loading) {
    return <div className="text-center text-lg">Loading...</div>;
  }

  return (
    <div className="flex flex-col items-center p-4 md:p-8">
      {Object.keys(chartData).length > 0 && chartData.labels && chartData.labels.length > 0 ? (
        <>
          <div className="w-full max-w-lg mb-4">
            <ul className="flex flex-wrap font-bold justify-center space-x-2">
              {chartData.labels.map((label, index) => (
                <li key={index} className="flex items-center space-x-1">
                  <span
                    className="inline-block w-3 h-3 rounded-full"
                    style={{ backgroundColor: chartData.datasets[0].backgroundColor[index] }}
                  ></span>
                  <span className="text-sm">{label}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="w-full max-w-lg h-64 md:h-80 mb-10">
            <Pie
              data={chartData}
              options={{
                maintainAspectRatio: false,
                plugins: {
                  legend: {
                    display: false,
                  },
                  datalabels: {
                    display: false,
                  },
                },
              }}
            />
          </div>
          <div className="bg-red-200 text-red-800 border border-red-300 rounded-lg shadow-lg p-4 w-full max-w-sm text-center">
            <h3 className="text-xl font-bold">EXPENSE: ₹{totalExpense.toFixed(2)}</h3>
          </div>
        </>
      ) : (
        <div className="text-center text-lg font-bold justify-center mx-auto mt-8">Hurray!!! You had no expense this month
        <div className="bg-red-200 text-red-800 border border-red-300 rounded-lg shadow-lg p-4 w-full max-w-sm text-center">
            <h3 className="text-xl font-bold">EXPENSE: ₹{totalExpense.toFixed(2)}</h3>
          </div>
        </div>
        
      )}
    </div>
  );
};

export default ExpenseChart;
