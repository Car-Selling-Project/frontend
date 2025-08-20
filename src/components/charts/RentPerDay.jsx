// import React from 'react';
// import { Bar } from 'react-chartjs-2';
// import { Chart as ChartJS, BarElement, CategoryScale, LinearScale, Tooltip, Legend } from 'chart.js';

// ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

// const RentalPerDayChart = () => {
//   const data = {
//     labels: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14', '15', '16', '31'],
//     datasets: [
//       {
//         label: 'Rental per Day',
//         data: [20, 25, 30, 35, 40, 45, 50, 55, 60, 45, 40, 35, 30, 25, 20, 15, 10],
//         backgroundColor: '#4682B4',
//         borderWidth: 1,
//       },
//     ],
//   };

//   const options = {
//     responsive: true,
//     maintainAspectRatio: false,
//     plugins: {
//       legend: {
//         display: false,
//       },
//       title: {
//         display: true,
//         text: 'Rental per Day',
//         font: {
//           size: 18,
//         },
//       },
//     },
//     scales: {
//       y: {
//         beginAtZero: true,
//         max: 60,
//       },
//     },
//   };

//   return (
//     <div style={{ width: '300px', height: '200px' }}>
//       <Bar data={data} options={options} />
//     </div>
//   );
// };

// export default RentalPerDayChart;

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
        label: 'Rental per Day',
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
      <Bar data={data} options={options} />
    </div>
  );
};

export default RentalPerDayChart;