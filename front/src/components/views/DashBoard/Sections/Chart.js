import React from 'react';
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
import { Line } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
);

export const options = {
  responsive: true,
  plugins: {
    legend: {
      position: 'top',
    },
    title: {
      display: true,
      text: '주간현황',
    },
  },
};

const date = new Date().toLocaleDateString();
let today = Date.parse(date);
const result = [];

const dateSetting = todayDate => {
  let month = new Date(todayDate).getMonth() + 1;
  if (month < 10) month = `0${month}`;
  let day = new Date(todayDate).getDate();
  if (day < 10) day = `0${day}`;
  return `${month}/${day}`;
};
result.push(dateSetting(today));
for (let i = 0; i < 6; i++) {
  today -= 86400000;
  result.push(dateSetting(today));
}

result.reverse();

const labels = result;

function Chart({ price }) {
  const data = {
    labels,
    datasets: [
      {
        label: '매출',
        data: price,
        borderColor: 'rgb(53, 162, 235)',
        backgroundColor: 'rgba(53, 162, 235, 0.5)',
      },
    ],
  };

  return (
    <div>
      {' '}
      <Line options={options} data={data} />;
    </div>
  );
}

export default Chart;
