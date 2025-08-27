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
        textColor: '#FFFFFF',
      },
    ],
  };

  // const options = {
  //   responsive: true,
  //   maintainAspectRatio: false,
  //   plugins: {
  //     legend: {
  //       display: false,
  //     },
  //     title: {
  //       display: true,
  //       text: 'Purchase per Day',
  //       font: {
  //         size: 30,
  //       },
  //     },
  //   },
  //   scales: {
  //     y: {
  //       beginAtZero: true,
  //       max: Math.max(...dataValues, 10) + 5,
  //     },
  //   },
  // };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
        labels: {
          color: "#fff", // legend text color
        },
      },
      title: {
        display: true,
        text: 'Purchase per Day',
        font: {
          size: 30,
        },
        color: "#fff", // title color
      },
    },
    scales: {
      x: {
        ticks: {
          color: "#fff", // x-axis label color
        },
        grid: {
          color: "rgba(255,255,255,0.1)", // x-axis grid color (optional)
        },
      },
      y: {
        beginAtZero: true,
        max: Math.max(...dataValues, 10) + 5,
        ticks: {
          color: "#fff", // y-axis label color
        },
        grid: {
          color: "rgba(255,255,255,0.1)", // y-axis grid color (optional)
        },
      },
    },
  };

  return (
    <div className='w-[300px] h-[200px] relative bg-white dark:bg-gray-800'>
      <Bar data={data} options={options} style={{ width: '100%', height: '100%' }} className='absolute top-0 left-0 text-[#1A202C] dark:text-white' />
    </div>
  );
};

export default RentalPerDayChart;