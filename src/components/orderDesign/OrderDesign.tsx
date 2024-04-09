import { useEffect, useState, useRef } from "react";
import { Button, Card, Modal, Select, Space, Table, Tooltip } from "antd";
import type { TableProps } from "antd";
import {
  getOrders,
  getOrdersDesign,
  updateStatusAdmin,
  updateStatusDesignAdmin,
  updateStatusRequest,
} from "../../apis/OrderApis";
import { getFormatPrice } from "../../utils/formatPrice";
import Loading from "../common/Loading";
import { ShowNotification } from "../../helpers/ShowNotification";
import { FormatMoney } from "../../helpers/FormatCurency";
import ModelDetailOrderDesign from "./ModelDetailOrderDesign";
import ModelCalculate from "./ModelCalculate";

interface DataType {
  id: number;
  name: string;
  status: string;
  address: string;
  total: number;
}

const OrderDesign = () => {
  const [data, setData] = useState<DataType[]>([]);
  const [flag, setFlag] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState(true);

  const [openOrderDetail, setOpenOrderDetail] = useState(false);
  const [openCalculate, setOpenCalculate] = useState(false);
  const [orderDetail, setOrderDetail] = useState<any>();

  useEffect(() => {
    (async () => {
      const response: any = await getOrdersDesign();
      if (response) {
        console.log(response);
        const modifiedData = response.map((item: DataType) => ({
          ...item,
          key: item.id, // Setting the key to the id returned from the backend
        }));
        setData(modifiedData);
        setIsLoading(false);
      }
    })();
  }, [flag]);

  const columns: TableProps<DataType>["columns"] = [
    {
      title: "Địa chỉ giao",
      dataIndex: "address",
      key: "address",
      render: (text) => <a>{text}</a>,
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      render: (_, record: any) => {
        return (
          <>
            <Tooltip
              title={
               ( Number(record.total)  <= 0&& record.status === 'IN_PROGRESS') ? "Vui lòng định giá đơn hàng." : ""
              }
            >
              <Select
                defaultValue={record.status}
                style={{
                  minWidth: 140,
                }}
                disabled={Number(record.total) <= 0}
                status={handleColorStatus(record.status)}
                onChange={(value) => {
                  handleChangeSelect(value, record);
                }}
                // disabled={handleDisableSelect(record.status)}
                options={handleSelectField(record.status)}
              />
            </Tooltip>
          </>
        );
      },
      filters: [
        {
          text: "Đã hủy",
          value: "IS_CANCELLED",
        },
        {
          text: "Đặt thành công",
          value: "IS_SUCCESS",
        },
        {
          text: "Đang xử lý",
          value: "IN_PROGRESS",
        },
        {
          text: "Đang vật chuyển",
          value: "IS_PENDING",
        },
        {
          text: "Đã Vận chuyển",
          value: "DELIVERED",
        },
        {
          text: "Đã trả lại hàng",
          value: "RETURNED",
        },
        {
          text: "Đã hoàng tiền",
          value: "REFUNDED",
        },
      ],
      onFilter: (value: string, record): boolean => {
        console.log(value);
        return record.status.indexOf(value) === 0;
      },
    },
    {
      title: "Giá",
      dataIndex: "total",
      key: "total",
      render: (_, record: any) => {
        console.log(record);
        return (
          <Space size="middle">
            {Number(record.total) <= 0 ? (
              <>
                <Button
                  className="bg-green-100 rounded-lg"
                  onClick={() => {
                    HandleShowDetailOrder(record);
                    setOpenCalculate(true); //
                  }}
                >
                  Định giá đơn hàng
                </Button>
              </>
            ) : (
              <>{FormatMoney(Number(record.total))}</>
            )}
          </Space>
        );
      },
      sorter: (a, b) => {
        return a.total - b.total;
      },
    },
    {
      title: "Xem chi tiết đơn hàng",
      key: "orderDetail",
      dataIndex: "orderDetail",
      render: (_, record: any) => (
        <Space size="middle">
          <div
            onClick={() => {
              HandleShowDetailOrder(record);
              setOpenOrderDetail(true);
            }}
            className="tex-xl font-medium cursor-pointer hover:text-blue-500 ml-8 transition-all duration-75"
          >
            Xem thêm
          </div>
        </Space>
      ),
    },
  ];

  const HandleShowDetailOrder = (value: any) => {
    setOrderDetail(value);
  };

  const handleChangeSelect = async (value: string, record: any) => {
    try {
      const response = await updateStatusDesignAdmin({
        orderId: record.id,
        status: value,
      });

      if (response) {
        setFlag(!flag);
        ShowNotification({
          message: "Thành công",
          description: "Cập nhật thành công trạng thái đơn hàng",
          type: "success",
        });
      } else {
        setFlag(!flag);
      }
    } catch (error: any) {
      if (error) {
        ShowNotification({
          message: "Cảnh báo",
          description: error.response.data.message,
          type: "warning",
        });
      }
      console.log(`error: ${error}`);
    }
  };

  const getValueStatus = (status: string) => {
    switch (status) {
      case "IN_PROGRESS":
        return "Đang xử lý";
      case "IN_PENDING":
        return "Đang vật chuyển";
      case "IN_SUCCESS":
        return "Đặt thành công";
      case "DELIVERED":
        return "Đã Vận chuyển";
      case "RETURNED":
        return "Đã trả lại hàng";
      case "REFUNDED":
        return "Đã hoàng tiền";
      default:
        return "";
    }
  };
  const handleColorStatus = (status: any): any => {
    switch (status) {
      case "IN_PROGRESS":
        return "warning";
      case "IN_PENDING":
        return "warning";
      case "IN_SUCCESS":
        return "success";
      case "DELIVERED":
        return "success";
      case "RETURNED":
        return "error";
      case "REFUNDED":
        return "error";
      default:
        return "";
    }
  };

  const handleSelectField = (status: string) => {
    switch (status) {
      case "IN_PROGRESS":
        return [
          { value: "IS_PENDING", label: "Đang gửi hàng" },
          { value: "IS_SUCCESS", label: "Thành công" },
          { value: "IS_CANCELLED", label: "Đã hủy đơn hàng" },
        ];
      case "IS_PENDING":
        return [{ value: "IS_PENDING", label: "Đang gửi hàng" }];
      case "IS_SUCCESS":
        return [
          { value: "RETURNED", label: "Đã trả lại hàng" },
          { value: "REFUNDED", label: "Đã hoàn tiền" },
        ];
      case "DELIVERED":
        return [
          { value: "IS_SUCCESS", label: "Thành công" },
          { value: "RETURNED", label: "Đã trả lại hàng" },
          { value: "REFUNDED", label: "Đã hoàn tiền" },
        ];
      case "RETURNED":
        return [{ value: "REFUNDED", label: "Đã hoàn tiền" }];
      case "REFUNDED":
        return [{ value: "REFUNDED", label: "Đã hoàn tiền" }];
      default:
        return [];
    }
  };

  const onChange: TableProps<DataType>["onChange"] = (
    pagination,
    filters,
    sorter,
    extra
  ) => {
    console.log("params", pagination, filters, sorter, extra);
  };

  return (
    <div className="mt-14">
      <Table
        columns={columns}
        dataSource={data}
        onChange={onChange}
        pagination={{
          pageSize: 4,
        }}
      />
      <ModelDetailOrderDesign
        openOrderDetail={openOrderDetail}
        setOpenOrderDetail={setOpenOrderDetail}
        orderDetail={orderDetail}
      />
      <ModelCalculate
        openOrderDetail={openCalculate}
        setOpenOrderDetail={setOpenCalculate}
        orderDetail={orderDetail}
        flag={flag}
        setFlag={setFlag}
      />
      <Loading
        isLoading={isLoading}
        setIsLoading={setIsLoading}
        messageTimeout="Lỗi gọi dữ liệu quá lâu"
      />
    </div>
  );
};

export default OrderDesign;
