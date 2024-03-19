import React, { useEffect, useState } from "react";
import { Card, Modal, Space, Table, Tag } from "antd";
import type { TableProps } from "antd";
import { getOrders } from "../../apis/OrderApis";
import { EyeOutlined } from "@ant-design/icons";
import { Button } from "antd/es/radio";
import ColumnGroup from "antd/es/table/ColumnGroup";
import Column from "antd/es/table/Column";

interface DataType {
  id: number;
  name: string;
  status: string;
  address: string;
  total: number;
}
const Order = () => {
  const [data, setData] = useState<DataType[]>([]);
  const [openUser, setOpenUser] = useState(false);
  const [user, setUser] = useState();
  const [openOrderDetail, setOpenOrderDetail] = useState(false);
  const [orderDetail, setOrderDetail] = useState<any[]>();
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

  useEffect(() => {
    (async () => {
      const response: any = await getOrders();
      if (response) {
        const modifiedData = response.map((item: DataType) => ({
          ...item,
          key: item.id, // Setting the key to the id returned from the backend
        }));
        setData(modifiedData);
      }
    })();
  }, []);

  const HandleShowUser = (value: any) => {
    setUser(value);
  };

  const HandleShowDetailOrder = (value: any) => {
    console.log(value);
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

  return (
    <div>
      <Table columns={columns} dataSource={data} />
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
        className="max-h-[27rem] overflow-auto"
      >
        {orderDetail &&
          orderDetail?.length > 0 &&
          orderDetail?.map((product: any, index: number) => (
            <Card
              title={product.productOption.Product.name}
              bordered={false}
              className="shadow-lg w-full my-4 bg-slate-50 mx-2"
              >
              <p>Card content</p>
              <p>Card content</p>
              <p>Card content</p>
            </Card>
          ))}
      </Modal>
    </div>
  );
};

export default Order;
