import Navbar from "@/components/Navbar";
import { Outlet } from "react-router";

const MainLayout = () => {
  return (
    <div className="bg-slate-50">
      <Navbar />
      <main>
        <Outlet />
      </main>
    </div>
  );
};

export default MainLayout;
