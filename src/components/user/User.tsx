import { useEffect, useState } from "react";
import { Button, Space, Table } from "antd";
import type { TableProps } from "antd";
import { deleteUser, getAllUserApi, getUsers } from "../../apis/UserApis";
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import ModalAddUser from "./ModalAddUser";
import { ShowNotification } from "../../helpers/ShowNotification";
import moment from "moment";
import { useAppSelector } from "../../hooks/userSelecter";

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
  const userRole = useAppSelector((state) => state.user.role);
  const [data, setData] = useState<DataType[]>([]);
  const [isOpenAdd, setIsOpenAdd] = useState<boolean>(false);
  const [isOpenEdit, setIsOpenEdit] = useState<boolean>(false);
  const [changeFlag, setChangeFlag] = useState<boolean>(false);
  const [userEdit, setUserEdit] = useState<any>({});
  const columns: TableProps<DataType>["columns"] = [
    {
      title: "Tên",
      dataIndex: "userName",
      key: "userName",
      render: (text) => <a>{text}</a>,
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "Số điện thoại",
      dataIndex: "phoneNumber",
      key: "phoneNumber",
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
          <>
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
          </>
        </Space>
      ),
    },
  ];

  useEffect(() => {
    (async () => {
      const response: any = await getAllUserApi();
      if (response?.isSuccess) {
        const modifiedData = response?.data?.map((item: any) => ({
          ...item,
          createdAt: moment(item.createdAt).format("DD-MM-YYYY"),
          key: item.id,
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
          {userRole === "ADMIN" && (
            <Button
              className="bg-blue-500 text-white font-medium"
              onClick={handleOpenAdd}
            >
              Thêm người dùng
            </Button>
          )}
        </div>
      </div>
      <Table
        columns={columns}
        dataSource={data}
        pagination={{
          pageSize: 4,
        }}
      />
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
