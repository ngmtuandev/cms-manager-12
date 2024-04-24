import React, { useEffect, useState } from "react";
import {
  getStatisticalOrder,
  getStatisticalOrderDesign,
  getStatisticalOrderDesignSelling,
} from "../../apis/Statistical.Api";
import { Select } from "antd";
import BarChart from "./chart/BarChart";
import LineChart from "./chart/LineChart";
import { FormatMoney } from "../../helpers/FormatCurency";
import Loading from "../common/Loading";
// import faker from 'faker';

const StaticOrderDesign = () => {
  const [dataModel, setDataModel] = useState<any>([]);
  const [showChart, setShowChart] = useState<string>("Bar");
  const [status, setStatus] = useState<string>("");
  const [label, setLabel] = useState<string>("order");
  const [total, setTotal] = useState<string>("");
  const [dataSets, setDataSets] = useState<any>();
  const [color, setColor] = useState<string>("rgba(53, 162, 235, 0.5)");
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    (async () => {
      try {
        setIsLoading(true);
        let response: any;

        if (label === "order") {
          response = await getStatisticalOrderDesign();
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
                label: "Đơn hàng ",
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
        } else if (label === "selling") {
          response = await getStatisticalOrderDesignSelling();
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
                label: "Đơn hàng ",
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
        }

        setTotal(response?.total);
        setIsLoading(false);
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
    if (value === "order") {
      setLabel("order");
      setColor("rgb(255, 99, 132)");
    } else if (value === "selling") {
      setLabel("selling");
      setColor("rgba(53, 162, 235, 0.5)");
    } else if (value === "") {
      setLabel("order");
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
                value: "order",
                label: "Theo đơn hàng",
              },
              {
                value: "selling",
                label: "Theo doanh thu",
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
      <div className="w-5/6 h-[26rem]">
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
      <Loading isLoading={isLoading} setIsLoading={setIsLoading} />
    </>
  );
};

export default StaticOrderDesign;
