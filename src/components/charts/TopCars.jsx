import React from 'react';
import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

const Top5CarChart = ({ totalByCarType = [], soldCars = [] }) => {
  // Use backend data for car types
  const labels = totalByCarType.map(item => item._id);
  const dataValues = totalByCarType.map(item => item.totalSold);

  // Fallback to mock data if no backend data
  const data = {
    labels: labels.length ? labels : ['Sedan', 'SUV', 'Pickup', 'Hatchback', 'MPV'],
    datasets: [
      {
        data: dataValues.length ? dataValues : [17, 9, 18, 12, 14],
        backgroundColor: [
          '#000080',
          '#1E90FF',
          '#4682B4',
          '#87CEEB',
          '#B0E0E6',
        ],
        borderWidth: 8,
      },
    ],
  };

  // Calculate total sold cars
  const totalSold = soldCars.reduce((sum, car) => sum + (car.totalSold || 0), 0);

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'right',
        labels: {
          font: {
            size: 18,
          },
        },
      },
      title: {
        display: true,
        text: 'Top 5 Car Selling',
        font: {
          size: 30
        },
      },
    },
  };

  return (
    <div style={{ position: 'relative', width: '500px', height: '500px' }}>
      <Doughnut data={data} options={options} width={500} height={500} style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }} />
      <div style={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-145%, -55%)',
        fontSize: '1.2em',
        fontWeight: 'bold',
        color: '#000',
        textAlign: 'center',
      }}>
        {totalSold || 0}<br />Sold Car
      </div>
    </div>
  );
};

export default Top5CarChart;