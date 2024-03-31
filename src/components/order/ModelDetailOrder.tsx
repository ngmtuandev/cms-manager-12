import { Button, Card, Modal } from "antd";
import React, { useRef } from "react";
import { FormatMoney } from "../../helpers/FormatCurency";
import { useReactToPrint } from "react-to-print";

type ModalDetailOrder = {
  openOrderDetail: boolean;
  setOpenOrderDetail: React.Dispatch<React.SetStateAction<boolean>>;
  orderDetail: any;
};

const ModelDetailOrder: React.FC<ModalDetailOrder> = React.forwardRef(
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
          </div>
          {orderDetail &&
            orderDetail?.OrderDetail?.length > 0 &&
            orderDetail?.OrderDetail?.map((product: any, index: number) => (
              <Card
                key={index}
                title={product.productOption.Product.name}
                bordered={false}
                className="shadow-lg w-full my-4 bg-slate-50 mx-2"
              >
                <div className="flex items-center">
                  <div className="w-1/2">
                    <p className="text-md font-medium">
                      Loại sản phẩm:{" "}
                      <span className="font-normal text-slate-400">
                        {product.productOption.Color.color} /{" "}
                        {product.productOption.Size.name}
                      </span>
                    </p>
                    <p className="text-md font-medium">
                      Số lượng:{" "}
                      <span className="font-normal text-slate-400">
                        {product.quantity}
                      </span>
                    </p>
                    <p className="text-md font-medium">
                      Giá:{" "}
                      <span className="font-normal text-slate-400">
                        {FormatMoney(product.productOption.Product.price)}
                      </span>
                    </p>
                  </div>
                  <div className="w-1/2 flex justify-center">
                    <img
                      className="w-[6rem] rounded-md shadow-lg"
                      src={product.productOption.Product.mainImage}
                      alt="hình ảnh sản phẩm"
                    />
                  </div>
                </div>
              </Card>
            ))}
        </div>
      </Modal>
    );
  }
);

export default ModelDetailOrder;
