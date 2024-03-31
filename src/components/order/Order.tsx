import React, { useEffect, useState, useRef } from "react";
import { Button, Card, Modal, Select, Space, Table } from "antd";
import type { TableProps } from "antd";
import {
  getOrders,
  updateStatusAdmin,
  updateStatusRequest,
} from "../../apis/OrderApis";
import { getFormatPrice } from "../../utils/formatPrice";
import Loading from "../common/Loading";
import { ShowNotification } from "../../helpers/ShowNotification";
import { FormatMoney } from "../../helpers/FormatCurency";
import ModelDetailOrder from "./ModelDetailOrder";

interface DataType {
  id: number;
  name: string;
  status: string;
  address: string;
  total: number;
}
const Order = () => {
  const [data, setData] = useState<DataType[]>([]);
  const [flag, setFlag] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState(true);

  const [openOrderDetail, setOpenOrderDetail] = useState(false);
  const [orderDetail, setOrderDetail] = useState<any>();

  useEffect(() => {
    (async () => {
      const response: any = await getOrders();
      if (response) {
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
          <Select
            defaultValue={record.status}
            style={{
              minWidth: 140,
            }}
            status={handleColorStatus(record.status)}
            onChange={(value) => {
              handleChangeSelect(value, record);
            }}
            // disabled={handleDisableSelect(record.status)}
            options={handleSelectField(record.status)}
          />
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
        return <Space size="middle">{FormatMoney(Number(record.total))}</Space>;
      },
      sorter: (a, b) => {
        return a.total - b.total;
      },
    },
    {
      title: "Phương thức thanh toán",
      key: "user",
      dataIndex: "user",
      render: (_, record: any) => (
        <Space size="middle">{getPayment(record.payment)}</Space>
      ),
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

  const getPayment = (payment: string) => {
    switch (payment) {
      case "UPON_RECEIPT":
        return <div>Thanh toán khi nhận hàng</div>;
      case "VNPAYMENT":
        return <div>Thanh toán bằng VNPAY</div>;
      default:
        return "Unknown status";
    }
  };

  const HandleShowDetailOrder = (value: any) => {
    setOrderDetail(value);
  };

  const handleChangeSelect = async (value: string, record: any) => {
    try {
      const response = await updateStatusAdmin({
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
      <Table columns={columns} dataSource={data} onChange={onChange} />

      <ModelDetailOrder
        openOrderDetail={openOrderDetail}
        setOpenOrderDetail={setOpenOrderDetail}
        orderDetail={orderDetail}
      />
      <Loading
        isLoading={isLoading}
        setIsLoading={setIsLoading}
        messageTimeout="Lỗi gọi dữ liệu quá lâu"
      />
    </div>
  );
};

export default Order;
