import React, { useEffect, useState, memo } from "react";
import {
  Button,
  Form,
  type FormProps,
  Input,
  Upload,
  UploadFile,
  UploadProps,
  Select,
  ColorPicker,
} from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { getSizes } from "../../apis/SizesApi";
import type { ColorPickerProps, GetProp } from 'antd';
import { ShowNotification } from "../../helpers/ShowNotification";

type FieldType = {
  sizeId?: string;
  fileList?: any;
  colorId?: any;
  color?: string;
  colorCode?: string;
  quantity?: number;
};

type AddOptionsProps = {
  options: any;
  setOption: any;
};

type Color = GetProp<ColorPickerProps, 'value'>;
type Format = GetProp<ColorPickerProps, 'format'>;

const AddOptions: React.FC<AddOptionsProps> = memo(({ options, setOption }) => {
  const [fileList, setFileList] = useState<UploadFile[]>();
  const [listImage, setListImage] = useState<any[]>();
  const [sizesSelect, setSizesSelect] = useState<any>();
  const [colorHex, setColorHex] = useState<Color>('#1677ff');
  const [formatHex, setFormatHex] = useState<Format>('hex');

  useEffect(() => {
    try {
      (async () => {
        const sizes: any = await getSizes();
        let sizesSelect: any = [];
        if (sizes) {
          sizes.forEach((element: any) => {
            const tmp = {
              value: element.id,
              label: element.name + element.caption,
            };
            sizesSelect.push(tmp);
          });
          setSizesSelect(sizesSelect);
        }
      })();
    } catch (error) {
      console.log(error);
      console.log(fileList);
      console.log(formatHex);
    }
    
  }, []);

  const handleChange: UploadProps["onChange"] = ({ fileList: newFileList }) => {
    const fileListImages: any = [];
    if (newFileList) {
      newFileList.forEach((file: any) => {
        const images = { filePath: file?.response?.url };
        fileListImages.push(images);
      });
    }
    setListImage(fileListImages);
    setFileList(newFileList);
  };

  const normFile = (e: any) => {
    if (Array.isArray(e)) {
      return e;
    }
    return e?.fileList;
  };

  const onFinish: FormProps<FieldType>["onFinish"] = (values:any) => {
    if(!colorHex) {
      ShowNotification({
        message: "Cảnh báo",
        description: "Chọn màu cho sản phẩm",
        type:"warning",
      })
      return;
    }

    if(!listImage) {
      ShowNotification({
        message: "Cảnh báo",
        description: "Thêm ảnh chi tiết cho sản phẩm",
        type:"warning",
      })
      return;

    }


    if(!values.quantity) {
      return;
    }

    setOption([...options, {
      ...values,
      quantity: parseInt(values.quantity),
      images: listImage,
      codeColor: hexString
    }]);
  };


  const onFinishFailed: FormProps<FieldType>["onFinishFailed"] = (
    errorInfo
  ) => {
    console.log("Failed:", errorInfo);
  };

  const hexString = React.useMemo<string>(
    () => (typeof colorHex === 'string' ? colorHex : colorHex?.toHexString()),
    [colorHex],
  );

  return (
    <Form
      name="basic"
      labelCol={{ span: 8 }}
      wrapperCol={{ span: 16 }}
      style={{ maxWidth: 600 }}
      initialValues={{ remember: true }}
      onFinish={onFinish}
      onFinishFailed={onFinishFailed}
      autoComplete="off"
      className="w-full"
    >
      <Form.Item
        label="kích thước"
        name="sizeId"
        rules={[{ required: true, message: "Vui lòng chọn kích cỡ!" }]}
      >
        <Select className="w-full" mode="multiple" options={sizesSelect} />
      </Form.Item>
      <Form.Item
        label="Hình ảnh"
        valuePropName="fileList"
        getValueFromEvent={normFile}
      >
        <Upload
          action={`${import.meta.env.VITE_BASE_URL}/image/upload`}
          listType="picture-card"
          onChange={handleChange}
          className="ml-2"
        >
          <button style={{ border: 0, background: "none" }} type="button">
            <PlusOutlined />
            <div style={{ marginTop: 8 }}>Hình ảnh </div>
          </button>
        </Upload>
      </Form.Item>
      <Form.Item<FieldType>
        label="Tên Màu"
        name="color"
        rules={[{ required: true, message: "Nhập tên màu!" }]}
      >
        <Input />
      </Form.Item>
      <Form.Item<FieldType>
        label="Số lượng"
        name="quantity"
        rules={[{ required: true, message: "Nhập số lượng áo" }]}
      >
        <Input type="number"/>
      </Form.Item>
      <Form.Item
        label="Chọn màu sắc hiển thị"
        valuePropName="codeColor"
        rules={[{ required: true, message: "chọn màu sắc!" }]}
      >
        <ColorPicker value={colorHex} onChange={setColorHex} onFormatChange={setFormatHex}/>
      </Form.Item>

      <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
        <Button type="primary" htmlType="submit">
          Thêm loại sản phẩm
        </Button>
      </Form.Item>
    </Form>
  );
});

export default AddOptions;
