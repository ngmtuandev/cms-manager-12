import { useEffect, useState } from "react";

import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  BellOutlined,
  UserOutlined,
  CopyOutlined,
  BarChartOutlined,
  ProductOutlined,
  PercentageOutlined,
} from "@ant-design/icons";
import { Layout, Menu, Button, theme } from "antd";
import AppRoutes from "../routers/AppRouters";
import { useNavigate } from "react-router-dom";
import path from "../utils/path";
import { getUserProfile } from "../store/slice/user";
import { useAppDispatch, useAppSelector } from "../hooks/userSelecter";
const { Header, Sider, Content } = Layout;

export default function Manager() {
  const [collapsed, setCollapsed] = useState(false);
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.user.role);
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!token) {
      navigate(path.SIGN_IN);
    }
    dispatch(getUserProfile());
  }, [token]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate(path.SIGN_IN);
  };


  return (
    <div className="w-full h-lvh">
      <Layout className="min-h-lvh">
        <Sider trigger={null} collapsible collapsed={collapsed}>
          <div className="w-full mt-4 text-2xl font-bold text-center text-white">
            MSC
          </div>
          <div className="demo-logo-vertical" />
          <Menu
            onClick={({ key }) => {
              if (key === "signout") {
                return;
              } else {
                navigate(key);
              }
            }}
            theme="dark"
            mode="inline"
            defaultSelectedKeys={["1"]}
            items={[
              {
                key: path.STATISTICAL,
                icon: <BarChartOutlined />,
                label: "Thống kê",
                children: [
                  {
                    key: path.STATISTICAL,
                    label: "Thống kê",
                  },
                  {
                    key: path.STATISTICAL_ORDER,
                    label: "Đơn hàng",
                  },
                  {
                    key: path.STATISTICAL_ORDER_DESIGN,
                    label: "Đơn thiết kế",
                  },
                ],
              },
              {
                
                key: path.USER,
                icon: <UserOutlined />,
                label: "Quản lý user",
                children: [
                  {
                    key: path.USER,
                    label: "Người dùng",
                  },
                ],
              },
              {
                key: path.ORDER,
                icon: <BellOutlined />,
                label: "Quản lý đơn hàng",
                children: [
                  {
                    key: path.ORDER,
                    label: "Đơn hàng",
                  },
                  {
                    key: path.ORDER_DESIGN,
                    label: "Đơn thiết kế",
                  },
                ],
              },
              user === "ADMIN" ? {
                key: path.RECEIPT,
                icon: <CopyOutlined />,
                label: "Quản lý nhập hàng",
                children: [
                  {
                    key: path.RECEIPT,
                    label: "Đơn Nhập hàng",
                  },
                  {
                    key: path.RECEIPT_ADD,
                    label: "Nhập hàng",
                  },
                ],
              }: null,
              {
                key: path.DISCOUNT,
                icon: <PercentageOutlined />,
                label: "Quản lý giảm giá",
              },
              user === "ADMIN" ? {
                key: path.PRODUCTS,
                icon: <ProductOutlined />,
                label: "Quản lý sản phẩm",
              }: null,
            ]}
          />
        </Sider>
        <Layout>
          <Header
            style={{
              padding: 0,
              background: colorBgContainer,
              display: "flex",
              justifyContent: "space-between",
            }}
          >
            <Button
              type="text"
              icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
              onClick={() => {
                setCollapsed(!collapsed);
              }}
              style={{
                fontSize: "16px",
                width: 64,
                height: 64,
              }}
            />
            <div className="m-[4px] px-8 flex justify-between ">
              <div className="font-bold text-md cursor-pointer mr-4">
                Khanh Nguyễn
              </div>
              <div
                className=" font-bold text-md cursor-pointer hover:text-blue-400"
                onClick={handleLogout}
              >
                LogOut
              </div>
            </div>
          </Header>
          <Content
            style={{
              margin: "24px 16px",
            }}
          >
            <div
              style={{
                padding: 24,
                minHeight: 360,
                background: colorBgContainer,
                borderRadius: borderRadiusLG,
              }}
            >
              <AppRoutes />
            </div>
            {/* render component */}
          </Content>
        </Layout>
      </Layout>
    </div>
  );
}
