import { DatePicker, DatePickerProps, Modal, Select } from "antd";

import { Button, Checkbox, Form, type FormProps, Input } from "antd";
import { Option } from "antd/es/mentions";
import React, { useEffect, useState } from "react";
import { addUser, updateUser } from "../../apis/UserApis";
import { ShowNotification } from "../../helpers/ShowNotification";
import { useNavigate } from "react-router-dom";
import path from "../../utils/path";
import TextArea from "antd/es/input/TextArea";
import { RangePickerProps } from "antd/es/date-picker";
import { createDiscount, updateDiscount } from "../../apis/DiscountApi";
import moment from "moment";
import dayjs from "dayjs";

type FieldType = {
  id: string;
  name: string;
  description: string;
  date: any;
  percent: string;
};

interface ModalAddUserProps {
  isOpen: boolean;
  setIsOpen: any;
  changeFlag: boolean;
  setChangeFlag: any;
  title: string;
  setUser?: any;
  discountEdit?: any;
}

const { RangePicker } = DatePicker;

const ModalDiscount: React.FC<ModalAddUserProps> = ({
  isOpen,
  setIsOpen,
  title,
  changeFlag,
  setChangeFlag,
  discountEdit,
}) => {
  const [form] = Form.useForm();
  const [dateStart, setDateStart] = useState<any>();
  const [dateEnd, setDateEnd] = useState<any>();
  const navigate = useNavigate();

  useEffect(() => {
    if (discountEdit) {
      console.log(discountEdit.dateStart);
      form.setFieldsValue({
        name: discountEdit.name,
        description: discountEdit.description,
        percent: discountEdit.percent,
      });
      setDateEnd(moment(discountEdit.dateEnd, "DD-MM-YYYY").toISOString());
      setDateStart(moment(discountEdit.dateStart, "DD-MM-YYYY").toISOString());
    }
  }, [discountEdit]);


  const onFinish: FormProps<FieldType>["onFinish"] = async (values) => {
    try {
      
      if (title === "Thêm giảm giá") {
        const response = await createDiscount({
          ...values,
          dateStart: dateStart,
          dateEnd: dateEnd,
          percent: parseInt(values.percent),
        });
        if (response) {
          ShowNotification({
            message: "Thành công",
            description: "Thêm Giảm giá thành công",
            type: "success",
          });
          setIsOpen(false);
          setChangeFlag(!changeFlag);
        }

      } else if (title === "Chỉnh sửa giảm giá") {
        const response = await updateDiscount({
          ...values,
          dateStart: dateStart,
          dateEnd: dateEnd,
          percent: parseInt(values.percent),
        }, discountEdit.id);
        if (response) {
          ShowNotification({
            message: "Thành công",
            description: "Chỉnh sửa thành công giá thành công",
            type: "success",
          });
          setIsOpen(false);
          setChangeFlag(!changeFlag);
        }
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

  
  const onChange = (
    value: RangePickerProps["value"],
    dateString: [string, string] | string
  ) => {
    setDateStart(moment(dateString[0], "DD-MM-YYYY").toISOString());
    setDateEnd(moment(dateString[1], "DD-MM-YYYY").toISOString());
  };

  return (
    <Modal
      open={isOpen}
      title={title}
      onOk={handleOk}
      onCancel={handleCancel}
      footer={""}
      className="max-h-[36rem] overflow-auto"
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
          label="Tên giảm giá"
          name="name"
          rules={[{ required: true, message: "Vui lòng nhập Họ!" }]}
        >
          <Input />
        </Form.Item>

        <Form.Item<FieldType>
          label="Mô tả"
          name="description"
          rules={[{ required: true, message: "Vui lòng nhập Tên!" }]}
        >
          <TextArea />
        </Form.Item>

        <Form.Item
          label="date"
 
          rules={[{ required: true, message: "Vui lòng chọn Ngày!" }]}
        >
          {discountEdit && (
            <RangePicker
              defaultValue={[
                dayjs(discountEdit.dateStart, "DD-MM-YYYY"),
                dayjs(discountEdit.dateEnd, "DD-MM-YYYY"),
              ]}
              format="DD-MM-YYYY"
              onChange={onChange}
            />
          )}
          {!discountEdit && (
            <RangePicker format="DD-MM-YYYY" onChange={onChange} />
          )}
        </Form.Item>

        <Form.Item
          label="Phần trăm"
          name="percent"
          rules={[{ required: true, message: "Vui lòng chọn vai trò!" }]}
        >
          <Input />
        </Form.Item>
        <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
          <Button htmlType="submit">{title}</Button>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default ModalDiscount;
