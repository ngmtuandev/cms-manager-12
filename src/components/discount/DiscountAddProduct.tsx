import React, { useEffect, useState } from "react";
import { Button, Table } from "antd";
import type { TableColumnsType } from "antd";
import { Link, useParams } from "react-router-dom";
import Loading from "../common/Loading";
import { getProducts } from "../../apis/ProductsApi";
import { ShowNotification } from "../../helpers/ShowNotification";
import { addProductToDiscount } from "../../apis/DiscountApi";

interface DataType {
  key: React.Key;
  id: number;
  name: string;
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
        const response = await addProductToDiscount(id, selectedRowKeys)
      
        console.log(response);
      })();
    } catch (error) {
      console.error(error);
    }
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
      <Table rowSelection={rowSelection} columns={columns} dataSource={data} />
      <Loading
        isLoading={isLoading}
        setIsLoading={setIsLoading}
        messageTimeout="Có lỗi xảy ra "
      />
    </div>
  );
};

export default DiscountAddProduct;
