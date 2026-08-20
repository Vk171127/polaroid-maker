import Navbar from "@/components/Navbar";
import { Link } from "react-router";
import { Outlet } from "react-router";

const MainLayout = () => {
  return (
    <div className="flex min-h-dvh flex-col bg-paper">
      <Navbar />
      <main className="flex-1">
        <Outlet />
      </main>
      <footer className="flex justify-center py-6">
        {/* <Link
          to="/admin/login"
          className="text-xs text-ink/30 hover:text-ink/50"
        >
          Staff login
        </Link> */}
      </footer>
    </div>
  );
};

export default MainLayout;
