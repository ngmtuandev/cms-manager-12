import React, { useEffect, useState } from "react";
import { Space, Table, Tag } from "antd";
import type { TableProps } from "antd";
import { getUsers } from "../../apis/UserApis";
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";

interface DataType {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  createdAt: string;
  role: string[];
}

const User = () => {
  const [data, setData] = useState<DataType[]>([]);
  const columns: TableProps<DataType>["columns"] = [
    {
      title: "Tên",
      dataIndex: "firstName",
      key: "firstName",
      render: (text) => <a>{text}</a>,
    },
    {
      title: "Họ",
      dataIndex: "lastName",
      key: "lastName",
      render: (text) => <a>{text}</a>,
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "Số điện thoại",
      dataIndex: "phone",
      key: "phone",
    },
    {
      title: "Ngày tạo",
      dataIndex: "createdAt",
      key: "createdAt",
    },
    {
      title: "Role",
      key: "role",
      dataIndex: "role",
    },
    {
      title: "Action",
      key: "action",
      render: (_, record) => (
        <Space size="middle">
          <EditOutlined className="text-xl cursor-pointer hover:text-blue-500"/>
          <DeleteOutlined className="text-xl cursor-pointer hover:text-blue-500" />
        </Space>
      ),
    },
  ];

  useEffect(() => {
    (async () => {
      const response: any = await getUsers();
      if (response) {
        const modifiedData = response.map((item: DataType) => ({
          ...item,
          key: item.id, // Setting the key to the id returned from the backend
        }));
        setData(modifiedData);
      }
    })();
  }, []);

  return (
    <div>
      <Table columns={columns} dataSource={data} />
    </div>
  );
};

export default User;
