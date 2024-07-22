import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Title, Tooltip, Legend } from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';

ChartJS.register(ArcElement, Title, Tooltip, Legend, ChartDataLabels);

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
                color: 'black', // Text color inside the pie chart
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
                  size: 12,
                  color: 'black'
                },
              },
            },
          }} 
        />
      </div>
      <div className="bg-green-200 text-green-800 border border-green-300 rounded-lg shadow-lg p-4 w-full max-w-sm text-center">
        <h3 className="text-xl font-bold">INCOME: ${totalIncome.toFixed(2)}</h3>
      </div>
    </div>
  );
};

export default IncomeChart;
