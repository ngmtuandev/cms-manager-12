import React, { useEffect, useState } from "react";
import { Button, Table } from "antd";
import type { TableColumnsType } from "antd";
import { Link, useParams } from "react-router-dom";
import Loading from "../common/Loading";
import { getProducts } from "../../apis/ProductsApi";
import { ShowNotification } from "../../helpers/ShowNotification";
import { addProductToDiscount } from "../../apis/DiscountApi";
import ModelProductOptions from "./ModelProductOptions";

interface DataType {
  key: React.Key;
  id: number;
  name: string;
  price: number;
  mainImage: string;
  options: any;
}

const Product = () => {
  const { id } = useParams();

  const [data, setData] = useState<DataType[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [openOptions, setOpenOptions] = useState<boolean>(false);
  const [options, setOptions] = useState<any>();

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
  }, []);

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
    {
      title: "Các lựa chọn",
      dataIndex: "mainImage",
      key: "mainImage",
      render: (_, record: any) => (
        <Button
          type="primary"
          onClick={() => {
            setOpenOptions(true);
            console.log(record.options);
            setOptions(record.options);
          }}
        >
          Xem thêm lựa chọn
        </Button>
      ),
    },
  ];

  return (
    <div>
      <Table
        columns={columns}
        dataSource={data}
        className="mt-14"
        pagination={{
          pageSize: 2,
        }}
      />
      <ModelProductOptions
        openOptions={openOptions}
        setOpenOptions={setOpenOptions}
        options={options}
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
