import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Line, Bar, Pie, Doughnut, Radar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, PointElement, LineElement, Title, Tooltip, Legend, ArcElement } from 'chart.js';


ChartJS.register(CategoryScale, LinearScale, BarElement, PointElement, ArcElement, LineElement, Title, Tooltip, Legend);

const ChartComponent = () => {
  const [chartData, setChartData] = useState({});
  const [loading, setLoading] = useState(true);

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

        // const labels = data.map(item => item.type);
        // const labels = ["Expenses", "Income"];
        // const values = data.map(item => item.amount);
        const labels = Object.keys(aggregatedData);
        const values = Object.values(aggregatedData);

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
      <h2>My Chart</h2>
      <div style={{ width: '100%', height: '600px' }}>
        <Pie 
          data={chartData} 
          options={{
            maintainAspectRatio: false,
            scales: {
              x: { 
                beginAtZero: true 
              },
              y: { 
                beginAtZero: true 
              }
            }
          }} 
        />
      </div>
    </div>
  );
};

export default ChartComponent;
