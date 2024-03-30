import { Card, Modal } from "antd";
import React from "react";
import { getFormatPrice } from "../../utils/formatPrice";

type ModelProductOptionsProps = {
  openOptions: boolean;
  setOpenOptions: any;
  options: any;
};

const ModelProductOptions: React.FC<ModelProductOptionsProps> = ({
  openOptions,
  setOpenOptions,
  options,
}) => {
  console.log(options);
  const handleOk = () => {
    setOpenOptions(false);
  };

  const handleCancel = () => {
    setOpenOptions(false);
  };

  return (
    <Modal
      open={openOptions}
      title="Chi tiết lựa chọn"
      onOk={handleOk}
      onCancel={handleCancel}
      footer={""}
      className="max-h-[28rem] overflow-auto"
    >
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
              <div className="w-1/2">
                <p className="text-md font-medium">
                  Loại sản phẩm:{" "}
                  <span className="font-normal text-slate-400">
                    {product?.Color?.color} / {product?.Size?.name}
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
