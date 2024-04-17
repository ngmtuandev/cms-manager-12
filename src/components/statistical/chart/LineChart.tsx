import React from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Line } from "react-chartjs-2";
import faker from "faker";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

export type LineProps = {
  labels?: string[];
  dataModel?: any[];
  dataSets?: any;
  label?: string;
  text?: string;
  color?: string;
};

const LineChart: React.FC<LineProps> = ({
  labels,
  dataModel,
  label,
  text,
  dataSets,
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
        borderColor: color || "rgb(255, 99, 132)",
        backgroundColor: color || "rgba(255, 99, 132, 0.5)",
      },
    ],
  };

  return <Line options={options} data={data} />;
};

export default LineChart;
