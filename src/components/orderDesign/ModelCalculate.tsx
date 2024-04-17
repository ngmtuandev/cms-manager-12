import { Button, Card, Input, Modal } from "antd";
import React, { useEffect, useRef, useState } from "react";
import { FormatMoney } from "../../helpers/FormatCurency";
import { useReactToPrint } from "react-to-print";
import { updateStatusDesignAdmin } from "../../apis/OrderApis";

type ModalDetailOrder = {
  openOrderDetail: boolean;
  setOpenOrderDetail: React.Dispatch<React.SetStateAction<boolean>>;
  orderDetail: any;
  flag: boolean;
  setFlag: React.Dispatch<React.SetStateAction<boolean>>;
};

const ModelCalculate: React.FC<ModalDetailOrder> = React.forwardRef(
  ({ openOrderDetail, setOpenOrderDetail, orderDetail, flag, setFlag }) => {
    const [price, setPrice] = useState(0);
    const [totalPrice, setTotalPrice] = useState();

    useEffect(() => {
      const sum = price * getAllProduct(orderDetail);
      setTotalPrice(sum);
    }, [price]);

    const handleOk = () => {
      setOpenOrderDetail(false);
    };

    const handleCancel = () => {
      setOpenOrderDetail(false);
    };

    const getAllProduct = (detailOrder: any): number => {
      let sum = 0;
      const detail = JSON.parse(detailOrder?.detail || "[]"); // Ensure detail is an array
      detail.forEach((item: any) => {
        sum += item.quantity;
      });
      return sum;
    };

    const handleCalculation = async () => {
      try {
        const response = await updateStatusDesignAdmin({
          orderId: orderDetail.id,
          status: 'IN_ACCEPT',
          total: totalPrice,
        });

        if (response) {
          setOpenOrderDetail(false);
          setFlag(!flag);
        }
      } catch (error) {
        console.log(error);
      }
    };

    return (
      <Modal
        open={openOrderDetail}
        title="Tính toán giá tiền"
        onOk={handleOk}
        onCancel={handleCancel}
        width={800}
        footer={[]}
        className="max-h-[34rem] overflow-auto"
      >
        <div className="w-full px-8 py-4">
          <div className="border-b-2 py-2">
            <h1 className="text-xl font-bold">Chi tiết số lượng:</h1>
            <h1 className="text-md font-bold">
              Tổng số áo:{" "}
              <span className="font-normal text-slate-400">
                {getAllProduct(orderDetail)}
              </span>
            </h1>
            <h1 className="text-md font-bold">
              Giá tiền của từng áo:{" "}
              <div className="w-1/3 flex">
                <Input
                  placeholder="số tiền"
                  value={price}
                  onChange={(e) => {
                    setPrice(Number(e.target.value));
                  }}
                  type="number"
                  className="mr-2 font-normal shadow-sm rounded-lg"
                />
                <Button
                  type="primary"
                  onClick={() => {
                    handleCalculation();
                  }}
                  disabled={Number(price) <= 0}
                >
                  Xác nhận
                </Button>
              </div>
            </h1>
            <h1 className="text-md font-bold">
              Giá trị đơn hàng:{" "}
              <span className="font-normal text-slate-400">
                {FormatMoney(Number(totalPrice))}= {getAllProduct(orderDetail)}{" "}
                x {FormatMoney(price)}
              </span>
            </h1>
          </div>

          {orderDetail &&
            orderDetail.detail &&
            JSON.parse(orderDetail.detail)?.length > 0 &&
            JSON.parse(orderDetail.detail)?.map(
              (product: any, index: number) => {
                console.log(product);
                return (
                  <Card
                    key={index}
                    title={product.id}
                    bordered={false}
                    className="shadow-lg w-full my-4 bg-slate-50 mx-2"
                  >
                    <div className="flex items-center">
                      <div className="w-1/2">
                        <p className="text-md font-medium">
                          Kích Thước{" "}
                          <span className="font-normal text-slate-400">
                            {product?.size?.name}- {product?.size?.caption}
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
                );
              }
            )}
        </div>
      </Modal>
    );
  }
);

export default ModelCalculate;
