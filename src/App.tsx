import React, { useEffect, useState } from "react";
import { Route, Router, Routes } from "react-router-dom";
import LoginPage from "./components/LoginPage";
import Manager from "./components/Manager";
import path from "./utils/path";

import Statistical from "./components/statistical/Statistical";
import Receipt from "./components/statistical/StaticReceipt";
import Order from "./components/statistical/StaticOrder";
import User from "./components/user/User";
import Discount from "./components/discount/Discount";
import Products from "./components/products/Products";

export default function App() {
  return (
    <Routes>
      <Route path={path.SIGN_IN} element={<LoginPage />}></Route>
      <Route path="/*" element={<Manager />}></Route>
    </Routes>
  );
}
