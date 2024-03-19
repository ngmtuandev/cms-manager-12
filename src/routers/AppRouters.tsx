import { createBrowserRouter } from "react-router-dom";
import Home from "../pages/Home";
import { RouterProvider } from "../libs/router-provider";
import path from "../utils/path";


const router = createBrowserRouter([
  {
    path: path.HOME ,
    element: <Home />,
  }
]);

export const AppRoutes = () => {
  return <RouterProvider router={router}></RouterProvider>;
};
