import React, { useEffect, useState } from "react";
import { Card, Modal, Select, Space, Table } from "antd";
import type { TableProps } from "antd";
import {
  getOrders,
  updateStatusAdmin,
  updateStatusRequest,
} from "../../apis/OrderApis";
import { getFormatPrice } from "../../utils/formatPrice";
import Loading from "../common/Loading";
import { ShowNotification } from "../../helpers/ShowNotification";

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
  const [openUser, setOpenUser] = useState(false);
  const [user, setUser] = useState<any>();
  const [openOrderDetail, setOpenOrderDetail] = useState(false);
  const [orderDetail, setOrderDetail] = useState<any[]>();

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
          text: "IS_CANCELED",
          value: "IS_CANCELED",
        },
        {
          text: "IS_SUCCESS",
          value: "IS_SUCCESS",
        },
        {
          text: "IN_PROGRESS",
          value: "IN_PROGRESS",
        },
        {
          text: "IS_PENDING",
          value: "IS_PENDING",
        },
        {
          text: "DELIVERED",
          value: "DELIVERED",
        },
        {
          text: "RETURNED",
          value: "RETURNED",
        },
        {
          text: "REFUNDED",
          value: "REFUNDED",
        },
      ],
      onFilter: (value: string, record) => record.name.indexOf(value) === 0,
    },
    {
      title: "Giá",
      dataIndex: "total",
      key: "total",
    },
    {
      title: "User",
      key: "user",
      dataIndex: "user",
      render: (_, record: any) => (
        <Space size="middle">
          <div
            onClick={() => {
              HandleShowUser(record?.user);
              setOpenUser(true);
            }}
            className="tex-xl font-medium cursor-pointer hover:text-blue-500 transition-all duration-75"
          >
            Xem thêm
          </div>
        </Space>
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
              HandleShowDetailOrder(record?.OrderDetail);
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

  const HandleShowUser = (value: any) => {
    setUser(value);
  };

  const HandleShowDetailOrder = (value: any) => {
    setOrderDetail(value);
  };

  const handleOk = () => {
    setOpenUser(false);
    setOpenOrderDetail(false);
  };

  const handleCancel = () => {
    setOpenUser(false);
    setOpenOrderDetail(false);
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

  // const handleDisableSelect = (status: string) => {
  //   if (
  //     status === "IS_SUCCESS" ||
  //     status === "IS_CANCELLED" ||
  //     status === "DELIVERED" ||
  //     status === "RETURNED" ||
  //     status === "REFUNDED"
  //   ) {
  //     return true;
  //   }
  //   return false;
  // };

  const onChange: TableProps<DataType>['onChange'] = (pagination, filters, sorter, extra) => {
    console.log('params', pagination, filters, sorter, extra);
  };

  return (
    <div className="mt-14">
      <Table columns={columns} dataSource={data} onChange={onChange}/>
      <Modal
        open={openUser}
        title="Thông Tin Người dùng"
        onOk={handleOk}
        onCancel={handleCancel}
        footer={""}
      >
        <div>
          <p className="font-medium">
            Họ & Tên:{" "}
            <span className="font-normal">
              {user?.firstName} {user?.lastName}
            </span>
          </p>
          <p className="font-medium">
            Email: <span className="font-normal">{user?.email}</span>
          </p>
          <p className="font-medium">
            Số điện thoại: <span className="font-normal">{user?.phone}</span>
          </p>
        </div>
      </Modal>
      <Modal
        open={openOrderDetail}
        title="Chi tiết đơn hàng"
        onOk={handleOk}
        onCancel={handleCancel}
        footer={""}
        className="max-h-[28rem] overflow-auto"
      >
        {orderDetail &&
          orderDetail?.length > 0 &&
          orderDetail?.map((product: any, index: number) => (
            <Card
              key={index}
              title={product.productOption.Product.name}
              bordered={false}
              className="shadow-lg w-full my-4 bg-slate-50 mx-2"
            >
              <div className="flex items-center">
                <div className="w-1/2">
                  <p className="text-md font-medium">
                    Loại sản phẩm:{" "}
                    <span className="font-normal text-slate-400">
                      {product.productOption.Color.color} /{" "}
                      {product.productOption.Size.name}
                    </span>
                  </p>
                  <p className="text-md font-medium">
                    Số lượng:{" "}
                    <span className="font-normal text-slate-400">
                      {product.quantity}
                    </span>
                  </p>
                  <p className="text-md font-medium">
                    Giá:{" "}
                    <span className="font-normal text-slate-400">
                      {getFormatPrice(product.productOption.Product.price)}
                    </span>
                  </p>
                </div>
                <div className="w-1/2 flex justify-center">
                  <img
                    className="w-[6rem] rounded-md shadow-lg"
                    src={product.productOption.Product.mainImage}
                    alt="hình ảnh sản phẩm"
                  />
                </div>
              </div>
            </Card>
          ))}
      </Modal>
      <Loading
        isLoading={isLoading}
        setIsLoading={setIsLoading}
        messageTimeout="Lỗi gọi dữ liệu quá lâu"
      />
    </div>
  );
};

export default Order;
