import { Modal, Select } from "antd";

import { Button, Checkbox, Form, type FormProps, Input } from "antd";
import { Option } from "antd/es/mentions";
import React, { useEffect } from "react";
import { addUser, updateUser } from "../../apis/UserApis";
import { ShowNotification } from "../../helpers/ShowNotification";
import { useNavigate } from "react-router-dom";
import path from "../../utils/path";

type FieldType = {
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  password?: string;
  role?: string;
};

interface ModalAddUserProps {
  isOpen: boolean;
  setIsOpen: any;
  changeFlag: boolean;
  setChangeFlag: any;
  title: string;
  user?: any;
  setUser?: any;
}

const ModalAddUser: React.FC<ModalAddUserProps> = ({
  isOpen,
  setIsOpen,
  title,
  changeFlag,
  setChangeFlag,
  user,
}) => {
  const [form] = Form.useForm();
  const navigate = useNavigate();

  const onFinish: FormProps<FieldType>["onFinish"] = async (values) => {
    try {
      let response;
      if (title === "Thêm người dùng") {
        response = await addUser(values)
      }else {
        response = await updateUser( user.id,values)

      }

      if (response) {
        ShowNotification({
          message: "Thành công",
          description: "Thêm người dùng thành công",
          type: "success",
        });
        setIsOpen(false);
        setChangeFlag(!changeFlag);
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

  const handleOk = () => {
    setIsOpen(false);
  };

  const handleCancel = () => {
    setIsOpen(false);
  };

  useEffect(() => {
    if (user) {
      console.log(user);
      form.setFieldsValue({
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        phone: user.phone,
        password: user.password,
        role: user.role,
      });
    }
  }, [user]);

  return (
    <Modal
      open={isOpen}
      title={title}
      onOk={handleOk}
      onCancel={handleCancel}
      footer={""}
      className="max-h-[28rem] overflow-auto"
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
          label="Họ"
          name="lastName"
          rules={[{ required: true, message: "Vui lòng nhập Họ!" }]}
        >
          <Input />
        </Form.Item>

        <Form.Item<FieldType>
          label="Tên"
          name="firstName"
          rules={[{ required: true, message: "Vui lòng nhập Tên!" }]}
        >
          <Input />
        </Form.Item>
        <Form.Item<FieldType>
          label="Email"
          name="email"
          rules={[{ required: true, message: "Vui lòng nhập email!" }]}
        >
          <Input />
        </Form.Item>
        <Form.Item<FieldType>
          label="Số điện thoại"
          name="phone"
          rules={[
            { required: true, message: "Vui lòng nhập số điện thoại!" },
            {
              pattern: /^(0|\+84)[1-9]\d{8}$/,
              message: "Số điện thoại không hợp lệ!",
            },
          ]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          name="role"
          label="Vai trò"
          rules={[{ required: true, message: "Vui lòng chọn vai trò!" }]}
        >
          <Select placeholder="Chọn vai trò" allowClear>
            <Option value="ADMIN">ADMIN</Option>
            <Option value="STAFF">STAFF</Option>
            <Option value="CUSTOMER">CUSTOMER</Option>
          </Select>
        </Form.Item>

        <Form.Item<FieldType>
          label="Mật khẩu"
          name="password"
          rules={[{ required: true, message: "Vui lòng nhập mật khẩu!" }]}
        >
          <Input.Password />
        </Form.Item>

        <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
          <Button htmlType="submit">Thêm người dùng</Button>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default ModalAddUser;
