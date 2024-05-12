import React, { useEffect, useState } from "react";
import { Button, Table } from "antd";
import type { TableColumnsType, TableProps } from "antd";
import { Link, useParams } from "react-router-dom";
import Loading from "../common/Loading";
import { getProducts } from "../../apis/ProductsApi";
import { ShowNotification } from "../../helpers/ShowNotification";
import { addProductToDiscount } from "../../apis/DiscountApi";
import { FormatMoney } from "../../helpers/FormatCurency";

interface DataType {
  key: React.Key;
  id: number;
  name: string;
  category: string;
  price: number;
  mainImage: string;
}

const columns: TableColumnsType<DataType> = [
  {
    title: "Tên sản phẩm",
    dataIndex: "name",
    key: "name",
  },
  {
    title: "Giá hiện tại",
    dataIndex: "price",
    key: "price",
    render: (_, record: any) => {
      return <div>{FormatMoney(record?.price)}</div>;
    },
  },
  {
    title: "loại",
    dataIndex: "category",
    key: "category",
    filters: [
      {
        text: "Áo thun",
        value: "Áo thun",
      },
      {
        text: "Áo Polo",
        value: "Áo Polo",
      },
      {
        text: "Áo sơmi",
        value: "Áo sơmi",
      },

      {
        text: "Áo khoác",
        value: "Áo khoác",
      },
      {
        text: "Quần short",
        value: "Quần short",
      },
      {
        text: "Quần jeans",
        value: "Quần jeans",
      },
    ],
    onFilter: (value: any, record:any) =>
      record.category.indexOf(value) === 0,
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
];

const DiscountAddProduct = () => {
  const { id } = useParams();
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [data, setData] = useState<DataType[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    try {
      (async () => {
        const response: any = await getProducts();
        const formatData: DataType[] = [];

        response.forEach((product: any) => {
          const productTmp = {
            ...product,
            key: product.id,
            category: product.Category.name,
          };
          formatData.push(productTmp);
        });

        if (response) {
          setData(formatData);
          setIsLoading(false);
        }
      })();
    } catch (error) {}
  }, []);

  const onSelectChange = (newSelectedRowKeys: React.Key[]) => {
    console.log("selectedRowKeys changed: ", newSelectedRowKeys);
    setSelectedRowKeys(newSelectedRowKeys);
  };

  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange,
  };

  const hasSelected = selectedRowKeys.length > 0;

  const handleAddProductToDiscount = () => {
    if (selectedRowKeys.length <= 0) {
      ShowNotification({
        message: "Cảnh báo",
        description: "Chọn sản phẩm",
        type: "warning",
      });
      return;
    }

    try {
      (async () => {
        const response = await addProductToDiscount(id, selectedRowKeys);

        if (response) {
          ShowNotification({
            message: "Thành công",
            description: "Thêm giảm giá cho sản phẩm thành công!",
            type: "success",
          });
        }
      })();
    } catch (error) {
      console.error(error);
    }
  };

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
      <div className="w-full flex justify-end">
        <Link to={"/discount"}>
          <Button type="primary" className="">
            trở lại
          </Button>
        </Link>
        <Button
          type="primary"
          className="ml-4"
          onClick={handleAddProductToDiscount}
        >
          Thêm sản giảm giá
        </Button>
      </div>
      <span style={{ marginLeft: 8 }}>
        {hasSelected ? `Selected ${selectedRowKeys.length} items` : ""}
      </span>
      <Table
        rowSelection={rowSelection}
        columns={columns}
        dataSource={data}
        onChange={onChange}
        pagination={{
          pageSize: 3,
        }}
      />
      <Loading
        isLoading={isLoading}
        setIsLoading={setIsLoading}
        messageTimeout="Có lỗi xảy ra "
      />
    </div>
  );
};

export default DiscountAddProduct;
