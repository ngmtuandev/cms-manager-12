import React, { useEffect, useState } from "react";
import { Card, Modal, Space, Table, Tag } from "antd";
import type { TableProps } from "antd";
import { getOrders } from "../../apis/OrderApis";
import { getFormatPrice } from "../../utils/formatPrice";

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
  const [user, setUser] = useState<any>();
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
    </div>
  );
};

export default Order;
