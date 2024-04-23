import React, { useEffect, useRef, useState } from "react";
import { Button, Input, Space, Table } from "antd";
import type {
  InputRef,
  TableColumnType,
  TableColumnsType,
  TableProps,
} from "antd";
import { Link, useParams } from "react-router-dom";
import Loading from "../common/Loading";
import { deleteProduct, getProducts } from "../../apis/ProductsApi";
import { ShowNotification } from "../../helpers/ShowNotification";

import ModelProductOptions from "./ModelProductOptions";
import { FormatMoney } from "../../helpers/FormatCurency";
import {
  AppstoreAddOutlined,
  DeleteOutlined,
  EditOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import ModelProductUpdate from "./ModelProductUpdate";
import { FilterDropdownProps } from "antd/es/table/interface";

interface DataType {
  key: React.Key;
  id: number;
  name: string;
  price: number;
  mainImage: string;
  options: any;
}

type DataIndex = keyof DataType;
const Product = () => {
  const { id } = useParams();

  const [data, setData] = useState<DataType[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [openOptions, setOpenOptions] = useState<boolean>(false);
  const [isUpdate, setIsUpdate] = useState<boolean>(false);
  const [product, setProductInfo] = useState<any>();
  const [options, setOptions] = useState<any>();
  const [changeFlag, setChangeFlag] = useState<boolean>(true);

  const [searchText, setSearchText] = useState("");
  const [searchedColumn, setSearchedColumn] = useState("");
  const searchInput = useRef<InputRef>(null);

  const handleSearch = (
    selectedKeys: string[],
    confirm: FilterDropdownProps["confirm"],
    dataIndex: DataIndex
  ) => {
    confirm();
    setSearchText(selectedKeys[0]);
    setSearchedColumn(dataIndex);
  };

  const handleReset = (clearFilters: () => void) => {
    clearFilters();
    setSearchText("");
  };

  const getColumnSearchProps = (
    dataIndex: DataIndex
  ): TableColumnType<DataType> => ({
    filterDropdown: ({
      setSelectedKeys,
      selectedKeys,
      confirm,
      clearFilters,
      close,
    }) => (
      <div style={{ padding: 8 }} onKeyDown={(e) => e.stopPropagation()}>
        <Input
          ref={searchInput}
          placeholder={`tìm kiếm sản phẩm`}
          value={selectedKeys[0]}
          onChange={(e) =>
            setSelectedKeys(e.target.value ? [e.target.value] : [])
          }
          onPressEnter={() =>
            handleSearch(selectedKeys as string[], confirm, dataIndex)
          }
          style={{ marginBottom: 8, display: "block" }}
        />
        <Space>
          <Button
            type="primary"
            onClick={() =>
              handleSearch(selectedKeys as string[], confirm, dataIndex)
            }
            icon={<SearchOutlined />}
            size="small"
            style={{ width: 90 }}
          >
            Tìm
          </Button>
          <Button
            onClick={() => clearFilters && handleReset(clearFilters)}
            size="small"
            style={{ width: 90 }}
          >
            đặt lại
          </Button>
        </Space>
      </div>
    ),
    filterIcon: (filtered: boolean) => (
      <SearchOutlined style={{ color: filtered ? "#1677ff" : undefined }} />
    ),
    onFilter: (value, record) =>
      record[dataIndex]
        .toString()
        .toLowerCase()
        .includes((value as string).toLowerCase()),
    onFilterDropdownOpenChange: (visible) => {
      if (visible) {
        setTimeout(() => searchInput.current?.select(), 100);
      }
    },
    render: (text) => (searchedColumn === dataIndex ? <>{text}</> : text),
  });

  useEffect(() => {
    try {
      (async () => {
        const response: any = await getProducts();

        const formatData: DataType[] = [];

        response.forEach((product: any, key: number) => {
          const productTmp = {
            ...product,
            key: key,
          };
          formatData.push(productTmp);
        });

        if (response) {
          setData(formatData);
          setIsLoading(false);
        }
      })();
    } catch (error) {}
  }, [changeFlag]);
  console.log(data);

  const handleDelete = async (id: number) => {
    try {
      const response = await deleteProduct(id);

      if (response) {
        ShowNotification({
          type: "success",
          message: `Thành công`,
          description: `Xóa thành công!`,
        });
        setChangeFlag(!changeFlag);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const columns: TableColumnsType<DataType> = [
    {
      title: "Tên sản phẩm",
      dataIndex: "name",
      key: "name",
      width: "30%",
      ...getColumnSearchProps("name"),
    },
    {
      title: "Giá hiện tại",
      dataIndex: "price",
      key: "price",
      render: (_, record: any) => {
        return <div>{FormatMoney(Number(record?.price))}</div>;
      },
    },
    {
      title: "Hình ảnh",
      dataIndex: "mainImage",
      key: "mainImage",
      render: (_, record: any) => (
        <img
          src={record.mainImage}
          alt="hình ảnh chi tiết"
          className="rounded-lg shadow-md w-[6rem]"
        />
      ),
    },
    {
      title: "Thao tác",
      dataIndex: "",
      key: "",
      render: (_, record: any) => (
        <Space size="middle">
          <EditOutlined
            onClick={() => {
              setIsUpdate(true);
              setProductInfo(record);
            }}
            className="text-xl cursor-pointer hover:text-blue-500"
          />
          <DeleteOutlined
            onClick={() => {
              handleDelete(Number(record.id));
            }}
            className="text-xl cursor-pointer hover:text-blue-500"
          />
          <AppstoreAddOutlined
            onClick={() => {
              setOpenOptions(true);
              setOptions(record.options);
              setProductInfo(record);
            }}
            className="text-xl cursor-pointer hover:text-blue-500"
          />
        </Space>
      ),
    },
  ];

  const onChange: TableProps<DataType>["onChange"] = (
    pagination,
    filters,
    sorter,
    extra
  ) => {
    console.log("params", pagination, filters, sorter, extra);
  };

  return (
    <div>
      <Table
        columns={columns}
        dataSource={data}
        className="mt-14"
        pagination={{
          pageSize: 2,
        }}
        onChange={onChange}
      />
      <ModelProductOptions
        productInfo={product}
        openOptions={openOptions}
        setOpenOptions={setOpenOptions}
        options={options}
      />
      <ModelProductUpdate
        product={product}
        isOpen={isUpdate}
        setIsOpen={setIsUpdate}
        isChange={changeFlag}
        setIsChange={setChangeFlag}
        title="Chỉnh sửa thông tin sản phẩm"
      />
      <Loading
        isLoading={isLoading}
        setIsLoading={setIsLoading}
        messageTimeout="Có lỗi xảy ra "
      />
    </div>
  );
};

export default Product;
