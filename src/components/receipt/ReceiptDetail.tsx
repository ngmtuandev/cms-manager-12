import React, { useEffect, useState } from "react";
import { Button, Carousel, Modal, Space, Spin, Table } from "antd";
import type { TableProps } from "antd";
import { Link, useNavigate } from "react-router-dom";
import path from "../../utils/path";
import { useAppDispatch, useAppSelector } from "../../hooks/userSelecter";

import { getSize } from "../../helpers/getSize";
import { FormatMoney } from "../../helpers/FormatCurency";

interface DataType {
  id: number;
  name: string;
  mainImage: string;
  price: number;
  nameShop: string;
  orderDetail: any;
}

const ReceiptDetail = () => {
  const receiptDetail = useAppSelector((state) => state.receipt.receiptDetail);
  const [openModal, setOpenModal] = useState(false);
  const [dataModal, setDataModal] = useState([]);
  const [data, setData] = useState<DataType[]>([]);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    setData(receiptDetail);
    if (receiptDetail.length <= 0) {
      navigate("/receipt")
    }
  }, []);

  const columns: TableProps<DataType>["columns"] = [
    {
      title: "Tên sản phẩm",
      dataIndex: "name",
      key: "name",
      render: (text) => <a>{text}</a>,
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
      title: "Giá",
      dataIndex: "price",
      key: "price",
      render: (_, record: any) => {
        return <div>{FormatMoney(Number(record?.price))}</div>;
      },
    },
    {
      title: "Mô tả",
      dataIndex: "description",
      key: "description",
      render: (text) => (
        <span className="w-[5rem]">
          <div className="truncate max-w-[10rem] max-h-[15rem]">{text}</div>
        </span>
      ),
    },
    {
      title: "Lựa chọn",
      key: "options",
      dataIndex: "options",
      render: (_, record: any) => (
        <Space size="middle">
          <div
            onClick={() => {
              setDataModal(JSON.parse(record.options));
              setOpenModal(true);
            }}
            className="tex-xl font-medium cursor-pointer hover:text-blue-500 ml-8 transition-all duration-75"
          >
            Xem thêm
          </div>
        </Space>
      ),
    },
  ];

  const showModal = () => {
    setOpenModal(true);
  };

  const handleOk = () => {
    setOpenModal(false);
  };

  const handleCancel = () => {
    setOpenModal(false);
  };

  const onChange = (currentSlide: number) => {
    console.log(currentSlide);
  };

  return (
    <div className="">
      <div className="w-full mb-6 flex justify-end">
        <div>
          <Link to={`/${path.RECEIPT}`}>
            <Button className="bg-blue-500 text-white font-medium">
              {" "}
              Trở về
            </Button>
          </Link>
        </div>
      </div>
      <Table columns={columns} dataSource={data} />
      <Modal
        open={openModal}
        title="Lựa chọn"
        onOk={handleOk}
        onCancel={handleCancel}
        footer={[]}
        className=" max-h-[34rem] overflow-auto "
      >
        {dataModal &&
          dataModal.map((option: any, index: number) => (
            <div className="w-full flex justify-between items-center p-4  stroke-gray-400 rounded-lg shadow-lg my-2">
              <div className="text-xl font-medium mr-6">{index + 1}</div>
              <div className="w-2/3">
                <p className="text-sm font-medium">
                  Màu sắc:{" "}
                  <span className="text-sm text-slate-500 font-normal">
                    {option.color}
                  </span>
                </p>
                <p className="text-sm font-medium">
                  Kích thước:{" "}
                  {option.sizeId &&
                    option.sizeId.map((size: any) => (
                      <>
                        <span className="text-sm text-slate-500 font-normal block">
                          {getSize(size).name}/{getSize(size).caption}
                        </span>
                        <span className="text-sm  font-medium block">
                          Số lượng:{" "}
                          <span className=" text-sm text-slate-500">
                            {option.quantity}
                          </span>
                        </span>
                      </>
                    ))}
                </p>
              </div>
              <div className="w-1/3 ">
                <Carousel afterChange={onChange}>
                  {option.images &&
                    option.images.length > 0 &&
                    option.images.map((image: any) => (
                      <img src={image.filePath} />
                    ))}
                </Carousel>
              </div>
            </div>
          ))}
      </Modal>
    </div>
  );
};

export default ReceiptDetail;
