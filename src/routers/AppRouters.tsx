import React from "react";
import { Route, Routes } from "react-router-dom";
import Statistical from "../components/statistical/Statistical";
import StaticOrder from "../components/statistical/StaticOrder";
import User from "../components/user/User";
import Discount from "../components/discount/Discount";
import Order from "../components/order/Order";
import Receipt from "../components/receipt/Receipt";
import Products from "../components/products/Products";
import path from "../utils/path";
import ReceiptAdd from "../components/receipt/ReceiptAdd";
import ReceiptDetail from "../components/receipt/ReceiptDetail";
import DiscountAddProduct from "../components/discount/DiscountAddProduct";
import OrderDesign from "../components/orderDesign/OrderDesign";
import StaticOrderDesign from "../components/statistical/StaticOrderDesign";

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Statistical />} />
      <Route path={path.STATISTICAL_ORDER} element={<StaticOrder />} />
      <Route
        path={path.STATISTICAL_ORDER_DESIGN}
        element={<StaticOrderDesign />}
      />
      <Route path={path.USER} element={<User />} />
      <Route path={path.DISCOUNT} element={<Discount />} />
      <Route path={path.ORDER} element={<Order />} />
      <Route path={path.ORDER_DESIGN} element={<OrderDesign />} />
      <Route path={path.RECEIPT} element={<Receipt />} />
      <Route
        path={path.DISCOUNT_ADD_PRODUCT}
        element={<DiscountAddProduct />}
      />
      <Route path={path.RECEIPT_DETAIL} element={<ReceiptDetail />} />
      <Route path={path.RECEIPT_ADD} element={<ReceiptAdd />} />
      <Route path={path.PRODUCTS} element={<Products />} />
    </Routes>
  );
};

export default AppRoutes;
