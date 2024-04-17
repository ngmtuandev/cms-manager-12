import React, { useEffect, useState } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

export type BarProps = {
  labels: string[];
  dataModel: any[];
  dataSets?: any;
  label?: string;
  text?: string;
  color?: string;
};

const BarChart: React.FC<BarProps> = ({
  labels,
  dataModel,
  dataSets,
  label,
  text,
  color,
}) => {
  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "top" as const,
      },
      title: {
        display: true,
        text: text || "",
      },
    },
  };
  const data = dataSets || {
    labels,
    datasets: [
      {
        label: label || "Đơn hàng trong tháng",
        data: dataModel,
        backgroundColor: color || "rgba(53, 162, 235, 0.5)",
      },
    ],
  };

  console.log(data);

  return <Bar options={options} data={data} />;
};

export default BarChart;
