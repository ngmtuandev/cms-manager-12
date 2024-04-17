import React, { useEffect, useState } from "react";
import { Pie } from "react-chartjs-2";
import {
  getAllStatistical,
  getOutOfStock,
  getTopSelling,
} from "../../apis/Statistical.Api";
import { useNavigate } from "react-router-dom";
import path from "../../utils/path";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { FormatMoney } from "../../helpers/FormatCurency";
import { Select } from "antd";
import LineChart from "./chart/LineChart";

ChartJS.register(ArcElement, Tooltip, Legend);

const Statistical = () => {
  const [dataModel, setDataModel] = useState<number[]>([0, 0]);
  const [showChart, setShowChart] = useState<string>("Selling");
  const [dataSets, setDataSets] = useState<any>();
  const navigate = useNavigate();

  useEffect(() => {
    (async () => {
      const response: any = await getAllStatistical();
      let items: any;

      if (showChart === "Selling") {
        items = await getTopSelling();
      } else if (showChart === "OutOfStock") {
        items = await getOutOfStock();
      }

      if (items) {
        console.log(items)
        setDataSets({
          labels: items?.items,
          datasets: [
            {
              label: "Sản phẩm",
              data: items?.quantity,
              backgroundColor: "rgba(53, 162, 235, 0.5)",
              borderColor: "rgba(53, 162, 235, 0.5)",
            },
          ],
        });
      }

      if (response) {
        setDataModel(response);
      }
    })();
  }, [showChart]);

  const handleChartClick = (event: any, elements: any) => {
    if (elements.length > 0) {
      const clickedElementIndex = elements[0].index;
      const clickedLabel = data.labels[clickedElementIndex];
      // Perform actions based on the clicked label
      console.log("Clicked label:", clickedLabel);
      if (clickedLabel === "Đơn Hàng") {
        navigate(path.STATISTICAL_ORDER);
      }
      if (clickedLabel === "Đơn Thiết kế") {
        navigate(path.STATISTICAL_ORDER_DESIGN);
      }
    }
  };

  const data = {
    labels: ["Đơn Hàng", "Đơn Thiết kế"],
    datasets: [
      {
        label: "Tổng đơn",
        data: dataModel,
        backgroundColor: ["rgba(255, 99, 132, 0.2)", "rgba(54, 162, 235, 0.2)"],
        borderColor: ["rgba(255, 99, 132, 1)", "rgba(54, 162, 235, 1)"],
        borderWidth: 1,
      },
    ],
  };

  const onShow = (value: string) => {
    setShowChart(value);
  };

  const onSearch = (value: string) => {
    console.log("search:", value);
  };

  // Filter `option.label` match the user type `input`
  const filterOption = (
    input: string,
    option?: { label: string; value: string }
  ) => (option?.label ?? "").toLowerCase().includes(input.toLowerCase());

  return (
    <div>
      <h1 className="text-2xl font-semibold">Thống kê</h1>
      <div className="w-full flex justify-around">
        <div className="w-[16rem] h-[20rem]">
          <h1 className="text-center font-medium text-2xl">Đơn hàng</h1>
          <Pie data={data} options={{ onClick: handleChartClick }} />
        </div>
        <div className="w-1/2">
          <h1 className="text-center font-medium text-2xl">Sản phẩm</h1>
          <div className="">
            <p>Chọn hiển thị:</p>
            <Select
              showSearch
              defaultValue="Sản phẩm bán chạy"
              placeholder="Hiển thị theo"
              optionFilterProp="children"
              onChange={onShow}
              onSearch={onSearch}
              filterOption={filterOption}
              className="min-w-[10rem]"
              options={[
                {
                  value: "Selling",
                  label: "Sản phẩm bán chạy",
                },
                {
                  value: "OutOfStock",
                  label: "Sản phẩm gần hết",
                },
              ]}
            />
          </div>

          <LineChart dataSets={dataSets} />
        </div>
      </div>
    </div>
  );
};

export default Statistical;
