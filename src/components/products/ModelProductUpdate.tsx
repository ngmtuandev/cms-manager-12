import { Card, Modal, Select } from "antd";
import React, { useEffect, useState } from "react";
import { getFormatPrice } from "../../utils/formatPrice";
import { FormatMoney } from "../../helpers/FormatCurency";

import { Button, Checkbox, Form, type FormProps, Input } from "antd";
import { Option } from "antd/es/mentions";

import { addUser, updateUser } from "../../apis/UserApis";
import { ShowNotification } from "../../helpers/ShowNotification";
import { useNavigate } from "react-router-dom";
import path from "../../utils/path";
import TextArea from "antd/es/input/TextArea";
import MainImages from "../receipt/upload/MainImages";
import { updateProduct } from "../../apis/ProductsApi";

type FieldType = {
  name?: string;
  description?: string;
  subDescription?: string;
  mainImage?: string;
  price?: any;
  password?: string;
  role?: string;
};

interface modelUpdateProduct {
  isOpen: boolean;
  setIsOpen: any;
  changeFlag?: boolean;
  setChangeFlag?: any;
  title: string;
  product?: any;
  setProduct?: any;
  isChange?: boolean;
  setIsChange?: any;
}

const normFile = (e: any) => {
  if (Array.isArray(e)) {
    return e;
  }
  return e?.fileList;
};

const ModelProductUpdate: React.FC<modelUpdateProduct> = ({
  isOpen,
  setIsOpen,
  setIsChange,
  product,
  isChange,
}) => {
  const [mainImage, setMainImage] = useState<any>();
  const handleOk = () => {
    setIsOpen(false);
  };

  const handleCancel = () => {
    setIsOpen(false);
  };

  const [form] = Form.useForm();
  const navigate = useNavigate();

  const onFinish: FormProps<FieldType>["onFinish"] = async (values) => {
    try {
      let response = await updateProduct(Number(product.id), values);

      if (response) {
        ShowNotification({
          message: "Thành công",
          description: "Cập nhật thành công",
          type: "success",
        });
        setIsOpen(false);
        setIsChange(!isChange);
      }
    } catch (error: any) {
      // handle show error
      if (error.response.data.statusCode === 403) {
        ShowNotification({
          message: "Lỗi",
          description: "Email đã tồn tại",
          type: "error",
        });
      } else if (error.response.data.message === "Unauthorized") {
        ShowNotification({
          message: "Lỗi",
          description: "Hết hạn đăng nhập",
          type: "error",
        });
        navigate(path.SIGN_IN);
      } else {
        ShowNotification({
          message: "Lỗi",
          description: error.response.data.message,
          type: "error",
        });
      }
    }
  };

  const onFinishFailed: FormProps<FieldType>["onFinishFailed"] = (
    errorInfo
  ) => {
    console.log("Failed:", errorInfo);
  };

  useEffect(() => {
    if (product) {
      form.setFieldsValue({
        name: product?.name,
        description: product?.description,
        subDescription: product?.subDescription,
        price: product?.price,
      });
      setMainImage(product.mainImage);
    }
  }, [product]);

  const validatePrice = (_: any, value: any) => {
    if (value >= 0) {
      return Promise.resolve();
    }
    return Promise.reject(new Error("Giá sản phẩm không được nhỏ hơn 0"));
  };

  return (
    <Modal
      open={isOpen}
      title="Chỉnh sửa sản phẩm"
      onOk={handleOk}
      onCancel={handleCancel}
      footer={""}
      className="max-h-[38rem] overflow-auto"
    >
      <Form
        form={form}
        name="basic"
        labelCol={{ span: 8 }}
        wrapperCol={{ span: 16 }}
        style={{ maxWidth: 600 }}
        initialValues={{ remember: true }}
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
        autoComplete="off"
      >
        <Form.Item<FieldType>
          label="Tên sản phẩm"
          name="name"
          rules={[{ required: true, message: "Vui lòng nhập tên sản phẩm!" }]}
        >
          <Input />
        </Form.Item>

        <Form.Item<FieldType>
          label="Giá sản phẩm"
          name="price"
          rules={[
            { required: true, message: "Vui lòng nhập giá sản phẩm!" },
            { validator: validatePrice },
          ]}
        >
          <Input type="number" />
        </Form.Item>

        <Form.Item<FieldType>
          label="Mô tả"
          name="description"
          rules={[{ required: true, message: "Vui lòng nhập mô tả!" }]}
        >
          <TextArea />
        </Form.Item>
        <Form.Item<FieldType>
          label="Mô tả thêm"
          name="subDescription"
          rules={[{ required: true, message: "Vui lòng nhập mô tả thêm!" }]}
        >
          <TextArea />
        </Form.Item>

        <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
          <Button htmlType="submit">cập nhật thông tin sản phẩm</Button>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default ModelProductUpdate;
