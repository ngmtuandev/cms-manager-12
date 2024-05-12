import  { useEffect, useState } from "react";
import {
  getStatisticalOrderDesign,
  getStatisticalOrderDesignSelling,
} from "../../apis/Statistical.Api";
import { Select } from "antd";
import BarChart from "./chart/BarChart";
import LineChart from "./chart/LineChart";
import { FormatMoney } from "../../helpers/FormatCurency";
import Loading from "../common/Loading";
import { DatePicker } from "antd";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
// import faker from 'faker';
const dateFormat = "YYYY/MM/DD";
const { RangePicker } = DatePicker;
dayjs.extend(utc);

const StaticOrderDesign = () => {
  const [showChart, setShowChart] = useState<string>("Bar");
  const [status, setStatus] = useState<string>("");
  const [label, setLabel] = useState<string>("order");
  const [total, setTotal] = useState<number>(0);
  const [dataSets, setDataSets] = useState<any>();
  const [color, setColor] = useState<string>("rgba(53, 162, 235, 0.5)");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [params, setParams] = useState({
    dateStart: "",
    dateEnd: "",
  });
  useEffect(() => {
    (async () => {
      try {
        setIsLoading(true);
        let response: any;

        if (label === "order") {
          response = await getStatisticalOrderDesign(params);
          const labelExtract = extractLabels(response);
          const dataExtract = extractData(response);
          setDataSets({
            labels: labelExtract,
            datasets: [
              {
                label: "Đơn hàng ",
                data: dataExtract,
                backgroundColor: "rgba(53, 162, 235, 0.5)",
                borderColor: "rgba(53, 162, 235, 0.5)",
              },
            ],
          });
          setTotal(0);
        } else if (label === "selling") {
          response = await getStatisticalOrderDesignSelling(params);
          const labelExtract = extractLabels(response[0]);
          const dataExtract = extractData(response[0]);
          setDataSets({
            labels: labelExtract,
            datasets: [
              {
                label: "Đơn hàng ",
                data: dataExtract,
                backgroundColor: "rgba(53, 162, 235, 0.5)",
                borderColor: "rgba(53, 162, 235, 0.5)",
              },
            ],
          });
          setTotal(response[1]);
        }
        setIsLoading(false);
      } catch (error) {
        console.log(error);
      }
    })();
  }, [status, params]);
  const onChangeChart = (value: string) => {
    setShowChart(value);
  };

  const extractLabels = (response: any) => {
    return response.map((label: any) => label.month);
  };

  const extractData = (response: any) => {
    return response.map((label: any) => label.count);
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

  const labels: any = [];
  console.log(total);
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
        <div className="mx-10">
          <p className="font-bold">Theo thời gian:</p>
          <RangePicker
            format={dateFormat}
            onChange={(value, dateString) => {
              console.log("Formatted Selected Time: ", dateString, value);

              const dateStart = dateString[0];
              if (dateStart !== "" && dateStart !== "") {
                const coverDateStart = dayjs(dateStart, dateFormat);
                const formattedDateStart = coverDateStart
                  .utc()
                  .subtract(1, "day")
                  .format("YYYY-MM-DDTHH:mm:ss.SSS[Z]");
                const dateEnd = dateString[1];
                const coverDateEnd = dayjs(dateEnd, dateFormat);
                const formattedDateEnd = coverDateEnd
                  .utc()
                  .subtract(1, "day")
                  .format("YYYY-MM-DDTHH:mm:ss.SSS[Z]");
                setParams({
                  dateStart: formattedDateStart,
                  dateEnd: formattedDateEnd,
                });
              } else {
                setParams({
                  dateStart: "",
                  dateEnd: "",
                });
              }
            }}
          />
        </div>
      </div>
      {total !== 0 && (
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
            labels={labels}
            label={label}
            text="Thống kê đơn thiết kế"
            dataSets={dataSets}
            color={color}
          />
        )}
        {showChart === "Line" && (
          <LineChart
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
