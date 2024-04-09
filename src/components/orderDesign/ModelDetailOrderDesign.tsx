import { Button, Card, Modal } from "antd";
import React, { useRef } from "react";
import { FormatMoney } from "../../helpers/FormatCurency";
import { useReactToPrint } from "react-to-print";

type ModalDetailOrder = {
  openOrderDetail: boolean;
  setOpenOrderDetail: React.Dispatch<React.SetStateAction<boolean>>;
  orderDetail: any;
};

const ModelDetailOrderDesign: React.FC<ModalDetailOrder> = React.forwardRef(
  ({ openOrderDetail, setOpenOrderDetail, orderDetail }) => {
    const handleOk = () => {
      setOpenOrderDetail(false);
    };

    const handleCancel = () => {
      setOpenOrderDetail(false);
    };

    const componentRef = useRef<any>();
    const handlePrint = useReactToPrint({
      content: () => componentRef.current,
    });

    const getAllProduct = (detailOrder: any): number => {
      let sum = 0;
      const detail = JSON.parse(detailOrder?.detail || "[]"); // Ensure detail is an array
      detail.forEach((item: any) => {
        sum += item.quantity;
      });
      return sum;
    };

    return (
      <Modal
        open={openOrderDetail}
        title="Chi tiết đơn hàng"
        onOk={handleOk}
        onCancel={handleCancel}
        footer={[
          <Button type="primary" onClick={handlePrint}>
            In Đơn hàng
          </Button>,
        ]}
        width={800}
        className="max-h-[34rem] overflow-auto"
      >
        <div className="w-full px-8 py-4" ref={componentRef}>
          <div className="border-y-2 py-2">
            <h1 className="text-xl font-bold">Thông tin khách hàng:</h1>
            <ul>
              <li className="font-medium">
                Họ và tên:{" "}
                <span className="font-normal">
                  {" "}
                  {orderDetail?.user?.firstName} {orderDetail?.user?.lastName}
                </span>
              </li>
              <li className="font-medium">
                Email:{" "}
                <span className="font-normal">{orderDetail?.user?.email}</span>
              </li>
              <li className="font-medium">
                Điện thoại:{" "}
                <span className="font-normal">{orderDetail?.user?.phone}</span>
              </li>
            </ul>
          </div>
          <div className="border-y-2 py-2">
            <h1 className="text-xl font-bold">Thông tin đơn hàng:</h1>
            <ul>
              <li className="font-medium">
                Thành tiền:{" "}
                <span className="font-normal">
                  {FormatMoney(orderDetail?.total)}
                </span>
              </li>
              <li className="font-medium">
                Trạng thái:{" "}
                <span className="font-normal">{orderDetail?.status}</span>
              </li>
              <li className="font-medium">
                Phương thức thanh toán:{" "}
                <span className="font-normal">{orderDetail?.payment}</span>
              </li>
            </ul>
          </div>
          <div className="border-b-2 py-2">
            <h1 className="text-xl font-bold">Chi tiết sản phẩm:</h1>
            <h1 className="text-md font-bold">
              Chất liệu:{" "}
              <span className="font-normal text-slate-400">
                {orderDetail?.material}
              </span>
            </h1>
            <h1 className="text-md font-bold">
              Mã màu áo:{" "}
              <span className="font-normal text-slate-400">
                {orderDetail?.colorCode}
              </span>
              <div
                style={{
                  backgroundColor: `${orderDetail?.colorCode}`
                }}
                className={`w-10 h-10 ml-2 rounded-md shadow-lg `}
              ></div>
            </h1>
            <h1 className="text-md font-bold">
              Tổng số áo:{" "}
              <span className="font-normal text-slate-400">
                {getAllProduct(orderDetail)}
              </span>
            </h1>
            {orderDetail?.image && (
              <h1 className="text-md font-bold">
                Hình ảnh áo:{" "}
                <a
                  className="font-normal text-blue-400"
                  href={orderDetail.image}
                  target="_blank"
                >
                  Xem Chi tiết
                </a>
              </h1>
            )}
            {orderDetail?.logo && (
              <h1 className="text-md font-bold">
                logo:{" "}
                <a
                  className="font-normal text-blue-400"
                  target="_blank"
                  href={orderDetail?.logo}
                >
                  Xem Chi tiết
                </a>
              </h1>
            )}
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

export default ModelDetailOrderDesign;
