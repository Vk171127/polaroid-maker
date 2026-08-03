import Dashboard from "@/pages/admin/dashboard";
import Login from "@/pages/admin/login";
import OrderDetails from "@/pages/admin/OrderDetails";
import Home from "@/pages/Home";
import NotFound from "@/pages/NotFound";
import { createBrowserRouter, Navigate, Outlet } from "react-router";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
  },
  {
    path: "/admin",
    element: <Outlet />,
    children: [
      {
        index: true,
        element: <Navigate to="/admin/dashboard" replace />,
      },
      {
        path: "login",
        element: <Login />,
      },
      {
        path: "dashboard",
        element: <Dashboard />,
      },
      {
        path: "orders/:id",
        element: <OrderDetails />,
      },
    ],
  },
  {
    path: "*",
    element: <NotFound />,
  },
]);
