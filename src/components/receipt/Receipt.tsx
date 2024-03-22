import React, { useEffect, useState } from "react";
import { Card, Modal, Space, Table, Tag } from "antd";
import type { TableProps } from "antd";
import { getReceipts } from "../../apis/ReceiptsApis";
import moment from "moment";
import { useNavigate } from "react-router-dom";
import path from "../../utils/path";
import { useAppDispatch } from "../../hooks/userSelecter";
import { setReceiptDetail } from "../../store/slice/receipt";


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
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  
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
              dispatch(setReceiptDetail(record.receiptDetail))
              navigate(path.RECEIPT_DETAIL)
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

  return (
    <div className="mt-14">
      <Table columns={columns} dataSource={data} />
    </div>
  );
};

export default Receipt;
