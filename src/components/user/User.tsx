import React, { useEffect, useState } from "react";
import { Button, Modal, Space, Table, Tag } from "antd";
import type { TableProps } from "antd";
import { deleteUser, getUsers } from "../../apis/UserApis";
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import ModalAddUser from "./ModalAddUser";
import { ShowNotification } from "../../helpers/ShowNotification";
import moment from "moment";

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
  const [isOpenAdd, setIsOpenAdd] = useState<boolean>(false);
  const [isOpenEdit, setIsOpenEdit] = useState<boolean>(false);
  const [changeFlag, setChangeFlag] = useState<boolean>(false);
  const [userEdit, setUserEdit] = useState<any>({});
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
          <EditOutlined
            onClick={() => {
              handleOpenEdit(record);
            }}
            className="text-xl cursor-pointer hover:text-blue-500"
          />
          <DeleteOutlined
            onClick={() => {
              handleDelete(record.id);
            }}
            className="text-xl cursor-pointer hover:text-blue-500"
          />
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
          createdAt: moment(item.createdAt).format("DD-MM-YYYY"),
          key: item.id, // Setting the key to the id returned from the backend
        }));
        setData(modifiedData);
      }
    })();
  }, [changeFlag]);

  const handleOpenAdd = () => {
    setIsOpenAdd(true);
  };

  const handleOpenEdit = (user: any) => {
    setIsOpenEdit(true);
    setUserEdit(user);
    // console.log(user)
  };

  const handleDelete = async (id: string) => {
    try {
      const response = await deleteUser(id);
      if (response) {
        setChangeFlag(!changeFlag);
        ShowNotification({
          message: "Thành công",
          description: "Xóa người dùng thành công",
          type: "success",
        });
      }
    } catch (error: any) {
      ShowNotification({
        message: "Lỗi",
        description: error.response.data.message,
        type: "error",
      });
    }
  };

  return (
    <div>
      <div className="w-full mb-6 flex justify-end">
        <div>
          <Button
            className="bg-blue-500 text-white font-medium"
            onClick={handleOpenAdd}
          >
            Thêm người dùng
          </Button>
        </div>
      </div>
      <Table columns={columns} dataSource={data} />
      <ModalAddUser
        isOpen={isOpenAdd}
        setIsOpen={setIsOpenAdd}
        changeFlag={changeFlag}
        setChangeFlag={setChangeFlag}
        title="Thêm người dùng"
      />
      <ModalAddUser
        user={userEdit}
        isOpen={isOpenEdit}
        setIsOpen={setIsOpenEdit}
        changeFlag={changeFlag}
        setChangeFlag={setChangeFlag}
        title="Chỉnh sửa người dùng"
      />
    </div>
  );
};

export default User;
