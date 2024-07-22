import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Title, Tooltip, Legend } from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';

ChartJS.register(ArcElement, Title, Tooltip, Legend, ChartDataLabels);

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

        const total = Object.values(aggregatedExpenseData).reduce((sum, value) => sum + value, 0);
        setTotalExpense(total);

        const labels = Object.keys(aggregatedExpenseData);
        const values = Object.values(aggregatedExpenseData);

        console.log("Processed labels:", labels);
        console.log("Processed values:", values);

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
  }, []);

  if (loading) {
    return <div className="text-center text-lg">Loading...</div>;
  }

  return (
    <div className="flex flex-col items-center p-4 md:p-8">
      <div className="w-full max-w-lg h-64 md:h-80 mb-10">
        <Pie 
          data={chartData} 
          options={{
            maintainAspectRatio: false,
            plugins: {
              legend: {
                display: false, // Hides the legend
              },
              datalabels: {
                color: '#fff', // Text color inside the pie chart
                display: true,
                formatter: (value, context) => {
                  const dataset = context.chart.data.datasets[context.datasetIndex];
                  const total = dataset.data.reduce((acc, val) => acc + val, 0);
                  const percentage = (value / total * 100).toFixed(2);
                  return `${context.chart.data.labels[context.dataIndex]}\n${percentage}%`;
                },
                anchor: 'center', // Center the labels inside the pie slices
                align: 'center',
                font: {
                  weight: 'bold',
                  size: 10
                },
              },
            },
          }} 
        />
      </div>
      <div className="bg-red-200 text-red-800 border border-red-300 rounded-lg shadow-lg p-4 w-full max-w-sm text-center">
        <h3 className="text-xl font-bold">EXPENSE: ${totalExpense.toFixed(2)}</h3>
      </div>
    </div>
  );
};

export default ExpenseChart;
