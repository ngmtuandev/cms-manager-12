import { useEffect, useState } from "react";
import {
  Button,
  Form,
  FormProps,
  Input,
  Select,
} from "antd";
import { getShops } from "../../apis/ShopApis";
import { getCategories } from "../../apis/Categories";
import Loading from "../common/Loading";
import MainImages from "./upload/MainImages";
import AddOptions from "./AddOptions";
import { ShowNotification } from "../../helpers/ShowNotification";
import TableShowOptions from "./TableShowOptions";
import { createReceipts } from "../../apis/ReceiptsApis";


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
  price?: number;

  receiptDetail: ReceiptDetail;
};

const normFile = (e: any) => {
  if (Array.isArray(e)) {
    return e;
  }
  return e?.fileList;
};

const ReceiptAdd = () => {
  const [form] = Form.useForm();
  const [isLoading, setIsLoading] = useState(true);
  const [shops, setShop] = useState();
  const [selectShopId, setSelectShopId] = useState<any>();
  const [selectShop, setSelectShop] = useState();
  const [selectCategories, setSelectCategories] = useState();
  const [addressShopSelect, setAddressShopSelect] = useState<number>();
  const [mainImage, setMainImage] = useState<any>();
  const [options, setOptions] = useState<any[]>([]);
  const [openDetailOrder, setOpenDetailOrder] = useState(false);
  const [product, setProduct] = useState<any>();

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
    if (!mainImage) {
      ShowNotification({
        message: "Cảnh báo",
        description: "Vui lòng đăng ảnh",
        type: "warning",
      });
      return;
    }
    setProduct({
      ...values,
      mainImage: mainImage?.url,
    });
    setOpenDetailOrder(true);
    console.log("Success:", values);
  };

  const onFinishFailed: FormProps<FieldType>["onFinishFailed"] = (
    errorInfo
  ) => {
    console.log("Failed:", errorInfo);
  };

  const handleChangeSelectShop = (value: string) => {
    setSelectShopId(parseInt(value));
    setAddressShopSelect(parseInt(value));
  };

  function getAddressShopById(id: any, shops: any) {
    if (shops) {
      const shop = shops.find((shop: any) => shop.id === id);
      return shop ? shop.address : null;
    }
  }

  function getNameShopById(id: any, shops: any) {
    if (shops) {
      const shop = shops.find((shop: any) => shop.id === id);
      return shop ? shop.name : null;
    }
  }

  const addOrders = async () => {
    try {
      if (!selectShopId) {
        ShowNotification({
          message: "Cánh báo",
          description: "Chọn nhà cung cấp!",
          type: "warning",
        });
        return;
      } else if (!product) {
        ShowNotification({
          message: "Cánh báo",
          description: "Chưa thêm thông tin sản phẩm!",
          type: "warning",
        });
        return;
      } else if (!options || options.length <= 0) {
        ShowNotification({
          message: "Cánh báo",
          description: "Chưa thêm lựa chọn cho sản phẩm!",
          type: "warning",
        });
        return;
      }
      const data = {
        shopId: selectShopId,
        nameShop: getNameShopById(selectShopId, shops),
        nameReceipt: `Nhập hàng từ  ${getNameShopById(selectShopId, shops)}`,
        receiptDetail: [
          {
            name: product?.name,
            category: product?.categoryId,
            mainImage: product?.mainImage,
            description: product?.description,
            subDescription: product?.subDescription,
            price: parseInt(product?.price),
            options: options,
          },
        ],
      };

      const response = await createReceipts(data);
      if (response) {
        ShowNotification({
          message: "Thêm thành công",
          description: "Nhập hàng thành công",
          type: "success",
        });
        setOptions([]);
        form.resetFields();
        setOpenDetailOrder(false)
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="h-auto">
      <div className="mb-4 flex items-center justify-between">
        <div className="">
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
                {getAddressShopById(addressShopSelect, shops)}
              </span>
            </div>
          )}
        </div>
        <div className="mt-8 mr-20">
          <Button onClick={addOrders} type="primary">
            Thêm đơn hàng
          </Button>
        </div>
      </div>
      <div className="w-full flex">
        <div className="w-1/2">
          <span className="text-xl font-medium ">Thông tin sản phẩm:</span>
          <Form
            name="AddOrderDetail"
            labelCol={{ span: 8 }}
            wrapperCol={{ span: 16 }}
            initialValues={{ remember: true }}
            onFinish={onFinish}
            onFinishFailed={onFinishFailed}
            autoComplete="off"
            className="w-4/5"
            form={form}
          >
            <Form.Item<FieldType>
              label="Tên sản phẩm"
              name="name"
              rules={[{ required: true, message: "Nhập tên sản phẩm!" }]}
            >
              <Input />
            </Form.Item>

            <Form.Item
              label="Loại sản phẩm"
              name="categoryId"
              rules={[{ required: true, message: "Chọn loại sản phẩm!" }]}
            >
              <Select options={selectCategories} />
            </Form.Item>

            <Form.Item<FieldType>
              label="Giá sản phẩm"
              name="price"
              rules={[{ required: true, message: "Nhập giá sản phẩm!" }]}
            >
              <Input type="number" />
            </Form.Item>

            <Form.Item
              label="Mô tả"
              name="description"
              rules={[{ required: true, message: "Nhập mô tả!" }]}
            >
              <Input.TextArea />
            </Form.Item>
            <Form.Item
              label="Mô tả thêm"
              name="subDescription"
              rules={[{ required: true, message: "Nhập mô tả thêm!" }]}
            >
              <Input.TextArea />
            </Form.Item>

            <Form.Item
              label="Hình ảnh chính"
              valuePropName="fileList"
              name="mainImage"
              getValueFromEvent={normFile}
            >
              <MainImages mainImage={mainImage} setMainImage={setMainImage} />
            </Form.Item>
            {!openDetailOrder && (
              <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
                <Button type="primary" htmlType="submit">
                  Thêm Chi tiết sản phẩm
                </Button>
              </Form.Item>
            )}
          </Form>
        </div>
        {openDetailOrder && (
          <div className="w-1/2 mr-4">
            <span className="text-xl font-medium">Thêm lựa chọn sản phẩm:</span>
            <AddOptions options={options} setOption={setOptions} />
          </div>
        )}
      </div>

      <div className="w-full">
        <p className="text-xl font-medium ">Các lựa chọn đã thêm</p>
        <TableShowOptions data={options} />
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
