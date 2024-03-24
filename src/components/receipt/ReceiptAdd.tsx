import React, { useEffect, useState } from "react";
import { PlusOutlined } from "@ant-design/icons";
import {
  Button,
  Cascader,
  Checkbox,
  ColorPicker,
  DatePicker,
  Form,
  FormProps,
  Input,
  InputNumber,
  Radio,
  Select,
  Slider,
  Switch,
  TreeSelect,
  Upload,
} from "antd";
import { getShops } from "../../apis/ShopApis";
import { getCategories } from "../../apis/Categories";
import Loading from "../common/Loading";
const { TextArea } = Input;

type images = {
  filePath?: string;
  caption?: string;
};

type option = {
  color?: string;
  colorCode?: string;
  sizeId?: number;
  quantity?: number;
  images?: images[];
};

type ReceiptDetail = {
  name?: string;
  price?: number;
  description?: string;
  subDescription?: string;
  mainImage?: string;
  categoryId?: number;
  options: option[];
};

type FieldType = {
  name?: string;
  shopId?: string;
  nameShopId?: string;
  receiptDetail: ReceiptDetail;
};

const normFile = (e: any) => {
  if (Array.isArray(e)) {
    return e;
  }
  return e?.fileList;
};

const ReceiptAdd = () => {
  const [orderDetail, setOrderDetail] = useState<ReceiptDetail[]>();
  const [isLoading, setIsLoading] = useState(true);

  const [shops, setShop] = useState();
  const [selectShop, setSelectShop] = useState();
  const [selectCategories, setSelectCategories] = useState();
  const [addressShopSelect, setAddressShopSelect] = useState<number>();

  useEffect(() => {
    try {
    setIsLoading(true);

      // call api get shop and format it
      (async () => {
        const shops: any = await getShops();
        let shopSelect: any = [];
        if (shops) {
          setShop(shops);

          shops.forEach((element: any) => {
            const tmp = {
              value: element.id,
              label: element.name,
            };
            shopSelect.push(tmp);
          });

          setSelectShop(shopSelect);
        }
      })();

      // call api get category and format it
      (async () => {
        const categories: any = await getCategories();
        let categoriesSelect: any = [];
        if (categories) {
          categories.forEach((element: any) => {
            const tmp = {
              value: element.id,
              label: element.name,
            };
            categoriesSelect.push(tmp);
          });
        }
        setIsLoading(false);

        setSelectCategories(categoriesSelect);
      })();
    } catch (error) {
      console.log(error);
    }
  }, []);

  const onFinish: FormProps<FieldType>["onFinish"] = (values) => {
    console.log("Success:", values);
  };

  const onFinishFailed: FormProps<FieldType>["onFinishFailed"] = (
    errorInfo
  ) => {
    console.log("Failed:", errorInfo);
  };

  const handleChangeSelectShop = (value: string) => {
    console.log(`selected ${value}`);
    setAddressShopSelect(parseInt(value));
  };

  function getAddressById(id: any, shops: any) {
    if (shops) {
      const shop = shops.find((shop: any) => shop.id === id);
      return shop ? shop.address : null;
    }
  }

  return (
    <div className="h-auto">
      <div className="mb-4">
        <span className="text-xl font-medium my-4 block">
          Thông tin nhà cung cấp:
        </span>
        <Select
          defaultValue="Chọn nhà cung cấp"
          style={{ width: 400 }}
          onChange={handleChangeSelectShop}
          options={selectShop}
        />
        {shops && (
          <div className="font-medium mt-2">
            Địa chỉ:{" "}
            <span className="font-normal">
              {getAddressById(addressShopSelect, shops)}
            </span>
          </div>
        )}
      </div>
      <div className="w-full flex">
        <div className="w-1/2 mr-4">
          <span className="text-xl font-medium ">Thông tin sản phẩm:</span>
          <Form
            name="AddOrderDetail"
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
              rules={[
                { required: true, message: "Please input your username!" },
              ]}
            >
              <Input />
            </Form.Item>

            <Form.Item
              label="Loại sản phẩm"
              name="categoryId"
              rules={[{ required: true, message: "Please input!" }]}
            >
              <Select options={selectCategories} />
            </Form.Item>

            <Form.Item
              label="Mô tả"
              name="description"
              rules={[{ required: true, message: "Please input!" }]}
            >
              <Input.TextArea />
            </Form.Item>
            <Form.Item
              label="Mô tả thêm"
              name="subDescription"
              rules={[{ required: true, message: "Please input!" }]}
            >
              <Input.TextArea />
            </Form.Item>

            <Form.Item
              label="Upload"
              valuePropName="fileList"
              getValueFromEvent={normFile}
            >
              <Upload action="/upload.do" listType="picture-card">
                <button style={{ border: 0, background: "none" }} type="button">
                  <PlusOutlined />
                  <div style={{ marginTop: 8 }}>Upload</div>
                </button>
              </Upload>
            </Form.Item>

            <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
              <Button type="primary" htmlType="submit">
                Submit
              </Button>
            </Form.Item>
          </Form>
        </div>
      </div>
      <div>
        <p>Các sản phẩm đã thêm</p>
        <p>table</p>
      </div>
      <Loading
        isLoading={isLoading}
        setIsLoading={setIsLoading}
        messageTimeout="Lỗi lỗi xảy ra"
      />
    </div>
  );
};

export default ReceiptAdd;
