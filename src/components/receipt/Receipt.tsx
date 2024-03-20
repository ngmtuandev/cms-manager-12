import React, { useEffect, useState } from "react";
import { Card, Modal, Space, Table, Tag } from "antd";
import type { TableProps } from "antd";
import { getFormatPrice } from "../../utils/formatPrice";
import { getReceipts } from "../../apis/ReceiptsApis";
import moment from "moment";
import { getSize } from "../../helpers/getSize";

interface DataType {
  id: number;
  nameReceipt: string;
  createdAt: string;
  totalPrice: number;
  nameShop: string;
  orderDetail: any;
}
const Receipt = () => {
  const [data, setData] = useState<DataType[]>([]);
  const [openUser, setOpenUser] = useState(false);
  const [user, setUser] = useState<any>();
  const [openOrderDetail, setOpenOrderDetail] = useState(false);
  const [orderDetail, setOrderDetail] = useState<any[]>();
  const columns: TableProps<DataType>["columns"] = [
    {
      title: "Tên Đơn hàng",
      dataIndex: "nameReceipt",
      key: "nameReceipt",
      render: (text) => <a>{text}</a>,
    },
    {
      title: "Ngày tạo",
      dataIndex: "createdAt",
      key: "createdAt",
    },
    {
      title: "Giá",
      dataIndex: "totalPrice",
      key: "totalPrice",
    },
    {
      title: "Cửa hàng nhập",
      dataIndex: "nameShop",
      key: "nameShop",
    },
    {
      title: "Xem chi tiết đơn hàng",
      key: "orderDetail",
      dataIndex: "orderDetail",
      render: (_, record: any) => (
        <Space size="middle">
          <div
            onClick={() => {
              console.log("OrderDetail");
              HandleShowDetailOrder(record.receiptDetail);
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
      const response: any = await getReceipts();
      if (response) {
        const modifiedData = response.map((item: DataType) => ({
          ...item,
          createdAt: moment(item.createdAt).format("DD-MM-YYYY"),
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

  console.log(orderDetail);

  return (
    <div className="mt-14">
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
        className="max-h-[28rem] overflow-auto "
      >
        {orderDetail &&
          orderDetail?.length > 0 &&
          orderDetail?.map((product: any, index: number) => (
            <Card
              key={index}
              title={product.name}
              bordered={false}
              className="shadow-lg w-full my-4 bg-slate-50 mx-2"
            >
              <div className="flex items-center">
                <div className="w-full">
                  <p className="text-md font-medium">
                    Giá:{" "}
                    <span className="font-normal text-slate-400">
                      {getFormatPrice(product.price)}
                    </span>
                  </p>
                  <ul className="text-md font-medium">
                    Lựa chọn:
                    {JSON.parse(product.options).map(
                      (element: any, index: number) => {
                        return (
                          <li className="font-medium text-sm my-4 text-black bg-white px-6 py-4 rounded-lg shadow-lg">
                            <p className=" font-medium">
                              Thông tin:{" "}
                              <span className="text-slate-400">
                                {element.color}/ {getSize(element.sizeId)?.name}
                              </span>
                            </p>
                            <p className="font-medium text-sm text-black">
                              Số lượng:
                              <span className="text-slate-400">
                                {" "}{element.quantity}
                              </span>
                            </p>
                            <p className="font-medium text-sm text-black">
                              Mô tả:{" "}
                              <span className="text-slate-400">
                                {getSize(element.sizeId)?.caption}
                              </span>
                            </p>
                          </li>
                        );
                      }
                    )}
                  </ul>
                </div>
                <div className="w-1/2 flex justify-center">
                  <img
                    className="w-[6rem] rounded-md shadow-lg"
                    src={product.mainImage}
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

export default Receipt;
