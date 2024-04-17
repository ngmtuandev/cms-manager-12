import React, { useEffect, useState } from "react";
import {
  getStatisticalOrder,
  getStatisticalOrderDesign,
} from "../../apis/Statistical.Api";
import { Select } from "antd";
import BarChart from "./chart/BarChart";
import LineChart from "./chart/LineChart";
import { FormatMoney } from "../../helpers/FormatCurency";
// import faker from 'faker';

const StaticOrderDesign = () => {
  const [dataModel, setDataModel] = useState<any>([]);
  const [showChart, setShowChart] = useState<string>("Bar");
  const [status, setStatus] = useState<string>("");
  const [label, setLabel] = useState<string>("");
  const [total, setTotal] = useState<string>("");
  const [dataSets, setDataSets] = useState<any>();
  const [color, setColor] = useState<string>("rgba(53, 162, 235, 0.5)");

  useEffect(() => {
    (async () => {
      try {
        const params = {
          status: status,
        };
        const response: any = await getStatisticalOrderDesign(params);
        if (response) {
          console.log("..", response);

          if (status === "") {
            setDataSets({
              labels: [
                "Tháng 1",
                "Tháng 2",
                "Tháng 3",
                "Tháng 4",
                "Tháng 5",
                "Tháng 6",
                "Tháng 7",
                "Tháng 8",
                "Tháng 9",
                "Tháng 10",
                "Tháng 11",
                "Tháng 12",
              ],
              datasets: [
                {
                  label: "Tổng đơn hàng",
                  data: response?.dataModel,
                  backgroundColor: "rgba(53, 162, 235, 0.5)",
                  borderColor: "rgba(53, 162, 235, 0.5)",
                },
                {
                  label: "Đơn hàng đã hủy",
                  data: response?.dataModelCancel,
                  borderColor: "rgb(255, 99, 132)",
                  backgroundColor: "rgb(255, 99, 132)",
                },
              ],
            });
          } else {
            setDataSets(null);
          }
          setTotal(response?.total);
          setDataModel(response?.dataModel);
        }
      } catch (error) {
        console.log(error);
      }
    })();
  }, [status]);

  const onChangeChart = (value: string) => {
    setShowChart(value);
  };

  const onChangeFilter = (value: string) => {
    setStatus(value);
    if (value === "IS_CANCELLED") {
      setLabel("Đơn hàng đã hủy");
      setColor("rgb(255, 99, 132)");
    } else if (value === "IS_SUCCESS") {
      setLabel("Đơn hàng đã đặt");
      setColor("rgba(53, 162, 235, 0.5)");
    } else if (value === "") {
      setLabel("Tổng đơn hàng");
      setColor("rgba(53, 162, 235, 0.5)");
    }
  };

  const onSearch = (value: string) => {
    console.log("search:", value);
  };

  // Filter `option.label` match the user type `input`
  const filterOption = (
    input: string,
    option?: { label: string; value: string }
  ) => (option?.label ?? "").toLowerCase().includes(input.toLowerCase());

  const labels = [
    "Tháng 1",
    "Tháng 2",
    "Tháng 3",
    "Tháng 4",
    "Tháng 5",
    "Tháng 6",
    "Tháng 7",
    "Tháng 8",
    "Tháng 9",
    "Tháng 10",
    "Tháng 11",
    "Tháng 12",
  ];

  return (
    <>
      <div className="w-full flex">
        <div className="">
          <p>Loại biểu đồ:</p>
          <Select
            showSearch
            placeholder="Loại biểu đồ"
            optionFilterProp="children"
            onChange={onChangeChart}
            onSearch={onSearch}
            filterOption={filterOption}
            className="min-w-[8rem]"
            options={[
              {
                value: "Bar",
                label: "Cột",
              },
              {
                value: "Line",
                label: "Đường",
              },
            ]}
          />
        </div>
        <div className="mx-10">
          <p>Hiển thị:</p>
          <Select
            showSearch
            placeholder="Hiển thị đơn hàng"
            optionFilterProp="children"
            onChange={onChangeFilter}
            onSearch={onSearch}
            className="min-w-[8rem]"
            filterOption={filterOption}
            options={[
              {
                value: "",
                label: "Tất cả",
              },
              {
                value: "IS_CANCELLED",
                label: "Đã hủy",
              },
              {
                value: "IS_SUCCESS",
                label: "Đã đặt",
              },
            ]}
          />
        </div>
      </div>
      {status !== "IS_CANCELLED" && (
        <div className="w-full my-4">
          <p className="font-bold">
            Tổng thu nhập:{" "}
            <span className="font-normal">{FormatMoney(Number(total))}</span>
          </p>
        </div>
      )}
      <div className="w-full h-[28rem]">
        {showChart === "Bar" && (
          <BarChart
            dataModel={dataModel}
            labels={labels}
            label={label}
            text="Thống kê đơn thiết kế"
            dataSets={dataSets}
            color={color}
          />
        )}
        {showChart === "Line" && (
          <LineChart
            dataModel={dataModel}
            labels={labels}
            label={label}
            text="Thống kê đơn thiết kế"
            dataSets={dataSets}
            color={color}
          />
        )}
      </div>
    </>
  );
};

export default StaticOrderDesign;
