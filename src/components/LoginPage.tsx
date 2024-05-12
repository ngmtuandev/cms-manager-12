import { Button, Form, type FormProps, Input } from "antd";
import { signIn } from "../apis/UserApis";
import { useNavigate } from "react-router-dom";
import { ShowNotification } from "../helpers/ShowNotification";
import { useState } from "react";
import Loading from "./common/Loading";

type FieldType = {
  email?: string;
  password?: string;
};

const LoginPage = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const onFinish: FormProps<FieldType>["onFinish"] = async (values: any) => {
    try {
      setIsLoading(true);
      const response = await signIn(values);
      if (response) {
        localStorage.setItem("token", JSON.stringify(response));
        setIsLoading(false);
        navigate("/");
      }
    } catch (error: any) {
      if (error.response.data.statusCode === 403) {
        ShowNotification({
          message: "Thất bại",
          description: error.response.data.message,
          type: "error",
        });
      }
      console.log(error);
    }
  };

  const onFinishFailed: FormProps<FieldType>["onFinishFailed"] = (
    errorInfo
  ) => {
    console.log("Failed:", errorInfo);
  };

  return (
    <>
      {isLoading && (
        <Loading isLoading={isLoading} setIsLoading={setIsLoading} />
      )}

      <div className="w-full h-lvh flex justify-center items-center">
        <Form
          name="basic"
          labelCol={{ span: 8 }}
          wrapperCol={{ span: 16 }}
          style={{ maxWidth: 600 }}
          initialValues={{ remember: true }}
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
          autoComplete="off"
          className=" px-16 py-4 shadow-lg rounded-md bg-white"
        >
          <h1 className="text-3xl font-bold my-8">Đăng nhập</h1>
          <Form.Item<FieldType>
            label="Tài khoản"
            name="email"
            rules={[{ required: true, message: "Please input your username!" }]}
          >
            <Input />
          </Form.Item>

          <Form.Item<FieldType>
            label="Mật khẩu"
            name="password"
            rules={[{ required: true, message: "Please input your password!" }]}
          >
            <Input.Password />
          </Form.Item>

          <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
            <Button htmlType="submit" className="bg-blue-500 text-white">
              Đăng nhập
            </Button>
          </Form.Item>
        </Form>
      </div>
    </>
  );
};

export default LoginPage;
