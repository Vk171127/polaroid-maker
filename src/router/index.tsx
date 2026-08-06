import MainLayout from "@/layout/MainLayout";
import About from "@/pages/About";
import Dashboard from "@/pages/admin/Dashboard";
import Login from "@/pages/admin/Login";
import OrderDetails from "@/pages/admin/OrderDetails";
import Home from "@/pages/Home";
import NotFound from "@/pages/NotFound";
import { createBrowserRouter, Navigate, Outlet } from "react-router";

export const router = createBrowserRouter([
  {
    element: <MainLayout />,
    children: [
      {
        path: "/",
        element: <Home />,
      },
      {
        path: "/about",
        element: <About />,
      },
    ],
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
