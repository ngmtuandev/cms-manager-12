import { useEffect, useState } from "react";
import { Button, Space, Table } from "antd";
import type { TableProps } from "antd";
import {
  AppstoreAddOutlined,
  DeleteOutlined,
  EditOutlined,
} from "@ant-design/icons";
import { ShowNotification } from "../../helpers/ShowNotification";
import moment from "moment";
import { useAppSelector } from "../../hooks/userSelecter";
import { deleteDiscount, getDiscounts } from "../../apis/DiscountApi";
import ModalDiscount from "./ModalDiscount";
import Loading from "../common/Loading";
import { useNavigate } from "react-router-dom";
interface DataType {
  id: string;
  name: string;
  description: string;
  dateStart: string;
  dateEnd: string;
  percent: string;
}

const Discount = () => {
  const userRole = useAppSelector((state) => state.user.role);
  const [data, setData] = useState<DataType[]>([]);
  const [isOpenAdd, setIsOpenAdd] = useState<boolean>(false);
  const [isOpenEdit, setIsOpenEdit] = useState<boolean>(false);
  const [changeFlag, setChangeFlag] = useState<boolean>(false);
  const [discountEdit, setDiscountEdit] = useState<any>({});
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const navigate = useNavigate();
  const columns: TableProps<DataType>["columns"] = [
    {
      title: "Tên giảm giá",
      dataIndex: "name",
      key: "name",
      render: (text) => <a>{text}</a>,
    },
    {
      title: "Mô tả",
      dataIndex: "description",
      key: "description",
      render: (text) => <a>{text}</a>,
    },
    {
      title: "Ngày bắt đầu",
      dataIndex: "dateStart",
      key: "phone",
    },
    {
      title: "Ngày kết thúc",
      dataIndex: "dateEnd",
      key: "dateEnd",
    },
    {
      title: "Phần trăm giảm",
      key: "percent",
      dataIndex: "percent",
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
          <AppstoreAddOutlined
            onClick={() => {
              navigate(`/discount/${record.id}/add_product`);
            }}
            className="text-xl cursor-pointer hover:text-blue-500"
          />
        </Space>
      ),
    },
  ];

  useEffect(() => {
    (async () => {
      setIsLoading(true);
      const response: any = await getDiscounts();
      if (response) {
        const modifiedData = response.map((item: DataType) => ({
          ...item,
          dateStart: moment(item.dateStart).format("DD-MM-YYYY"),
          dateEnd: moment(item.dateEnd).format("DD-MM-YYYY"),
          key: item.id, // Setting the key to the id returned from the backend
        }));
        setData(modifiedData);
        setIsLoading(false);
      }
    })();
  }, [changeFlag]);

  const handleOpenAdd = () => {
    setIsOpenAdd(true);
  };

  const handleOpenEdit = (discount: any) => {
    setIsOpenEdit(true);
    setDiscountEdit(discount);
  };

  const handleDelete = async (id: string) => {
    try {
      const response = await deleteDiscount(id);
      if (response) {
        setChangeFlag(!changeFlag);
        ShowNotification({
          message: "Thành công",
          description: "Xóa giảm giá thành công",
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
              Thêm giảm giá
            </Button>
          )}
        </div>
      </div>
      <Table columns={columns} dataSource={data} />
      <ModalDiscount
        isOpen={isOpenAdd}
        setIsOpen={setIsOpenAdd}
        changeFlag={changeFlag}
        setChangeFlag={setChangeFlag}
        title="Thêm giảm giá"
      />
      <ModalDiscount
        isOpen={isOpenEdit}
        setIsOpen={setIsOpenEdit}
        changeFlag={changeFlag}
        setChangeFlag={setChangeFlag}
        title="Chỉnh sửa giảm giá"
        discountEdit={discountEdit}
      />
      <Loading
        isLoading={isLoading}
        setIsLoading={setIsLoading}
        messageTimeout="Lỗi gọi dữ liệu quá lâu"
      />
    </div>
  );
};

export default Discount;
