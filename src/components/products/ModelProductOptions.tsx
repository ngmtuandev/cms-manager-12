import { Card, Modal } from "antd";
import React, { useState } from "react";
import { FormatMoney } from "../../helpers/FormatCurency";

type ModelProductOptionsProps = {
  productInfo?: any;
  openOptions: boolean;
  setOpenOptions: any;
  options: any;
};

const ModelProductOptions: React.FC<ModelProductOptionsProps> = ({
  productInfo,
  openOptions,
  setOpenOptions,
  options,
}) => {
  console.log(options)
  const [isShowDescription, setIsShowDescription] = useState(false);
  const [isShowSubDescription, setIsShowSubDescription] = useState(false);

  const handleOk = () => {
    setOpenOptions(false);
  };

  const handleCancel = () => {
    setOpenOptions(false);
  };

  return (
    <Modal
      open={openOptions}
      title="Thông tin chi tiết sản phẩm"
      onOk={handleOk}
      onCancel={handleCancel}
      footer={""}
      className="max-h-[28rem] overflow-auto"
    >
      <div className="font-medium">
        Tên sản phẩm: <span className="font-normal">{productInfo?.name}</span>
      </div>
      <div className="font-medium">
        Giá:{" "}
        <span className="font-normal">
          {FormatMoney(Number(productInfo?.price))}
        </span>
      </div>
      <div className="font-medium  w-full ">
        <div
          className={`${
            isShowDescription ? "line-clamp-none" : "line-clamp-3"
          }`}
        >
          Mô tả:{" "}
          <span className="font-normal ">{productInfo?.description}</span>
        </div>
        <a
          className="inline-block w-full text-end"
          onClick={() => {
            setIsShowDescription(!isShowDescription);
          }}
        >
          xem thêm
        </a>
      </div>
      <div className="font-medium  w-full">
        <div
          className={`${
            isShowSubDescription ? "line-clamp-none" : "line-clamp-3"
          }`}
        >
          Mô tả thêm:{" "}
          <span className="font-normal ">{productInfo?.subDescription}</span>
        </div>
        <a
          className="inline-block w-full text-end"
          onClick={() => {
            setIsShowSubDescription(!isShowSubDescription);
          }}
        >
          xem thêm
        </a>
      </div>
      <div className="font-medium">Các lựa chọn:</div>
      {options &&
        options?.length > 0 &&
        options?.map((product: any, index: number) => (
          <Card
            key={index}
            title={product?.Product?.name}
            bordered={false}
            className="shadow-lg w-full my-4 bg-slate-50 mx-2"
          >
            <div className="flex items-center">
              <div className="w-full">
                <p className="text-md font-medium">
                  Kích thước:{" "}
                  <span className="font-normal text-slate-400">
                    {product?.Size?.name} / {product?.Size?.caption}
                  </span>
                </p>
                <p className="text-md font-medium">
                  Màu sắc/ mã màu:{" "}
                  <span className="font-normal text-slate-400">
                    {product?.Color?.color} / {product?.Color?.codeColor}
                  </span>
                </p>
                <p className="text-md font-medium">
                  Số lượng:{" "}
                  <span className="font-normal text-slate-400">
                    {product?.quantity}
                  </span>
                </p>
              </div>
            </div>
          </Card>
        ))}
    </Modal>
  );
};

export default ModelProductOptions;
