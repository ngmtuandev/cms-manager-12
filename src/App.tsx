import React, { useEffect, useState } from "react";
import { Route, Router, Routes } from "react-router-dom";
import LoginPage from "./components/LoginPage";
import Manager from "./components/Manager";
import path from "./utils/path";

export default function App() {
  return (
    <Routes>
      <Route path={path.SIGN_IN} element={<LoginPage />}></Route>
      <Route path="/*" element={<Manager />}></Route>
    </Routes>
  );
}
