import React from 'react';
import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

const Top5CarChart = () => {
  const data = {
    labels: ['Sedan', 'SUV', 'Pickup', 'Hatchback', 'MPV'],
    datasets: [
      {
        data: [17.439, 9.478, 18.197, 12.510, 14.406],
        backgroundColor: [
          '#000080',
          '#1E90FF',
          '#4682B4',
          '#87CEEB',
          '#B0E0E6',
        ],
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'right',
      },
      title: {
        display: true,
        text: 'Top 5 Car Selling',
        font: {
          size: 18,
        },
      },
    },
  };

  return (
    <div style={{ position: 'relative', width: '300px', height: '300px' }}>
      <Doughnut data={data} options={options} />
      <div style={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        fontSize: '1.2em',
        fontWeight: 'bold',
        color: '#000',
      }}>
        72,030<br />Sold Car
      </div>
    </div>
  );
};

export default Top5CarChart;