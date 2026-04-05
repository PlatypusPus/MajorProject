import React from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const EmissionsChart = ({ emissions }) => {
  if (!emissions || emissions.length === 0) {
    return <p>No emission data available to display.</p>;
  }

  const sorted = [...emissions].sort(
    (a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
  );

  const data = {
    labels: sorted.map((entry) => new Date(entry.timestamp).toLocaleString()),
    datasets: [
      {
        label: 'CO₂ Emissions (kg)',
        data: sorted.map((entry) => Number(entry.co2_emissions || 0)),
        fill: false,
        backgroundColor: 'rgb(75, 192, 192)',
        borderColor: 'rgba(75, 192, 192, 1)',
      },
    ],
  };

  const options = {
    scales: {
      y: {
        beginAtZero: true
      }
    },
    responsive: true,
    maintainAspectRatio: false
  };

  return <div style={{ height: '400px' }}><Line data={data} options={options} /></div>;
};

export default EmissionsChart;
