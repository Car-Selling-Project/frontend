import React from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, BarElement, CategoryScale, LinearScale, Tooltip, Legend } from 'chart.js';

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

const RentalPerDayChart = ({ orders = [] }) => {
  // Aggregate rentals per day (by createdAt date)
  const dayCounts = {};
  orders.forEach(order => {
    const day = new Date(order.createdAt).getDate();
    dayCounts[day] = (dayCounts[day] || 0) + 1;
  });

  // Prepare chart data
  const labels = Array.from({ length: 31 }, (_, i) => (i + 1).toString());
  const dataValues = labels.map(day => dayCounts[parseInt(day)] || 0);

  const data = {
    labels,
    datasets: [
      {
        label: 'Purchase per Day',
        data: dataValues,
        backgroundColor: '#4682B4',
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      title: {
        display: true,
        text: 'Rental per Day',
        font: {
          size: 18,
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        max: Math.max(...dataValues, 10) + 5,
      },
    },
  };

  return (
    <div style={{ width: '300px', height: '200px' }}>
      <Bar data={data} options={options} style={{ width: '100%', height: '100%' }} />
    </div>
  );
};

export default RentalPerDayChart;