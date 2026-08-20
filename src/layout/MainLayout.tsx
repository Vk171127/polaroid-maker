import Navbar from "@/components/Navbar";
import { Outlet } from "react-router";
const MainLayout = () => <div className="min-h-screen bg-paper"><Navbar /><main><Outlet /></main></div>;
export default MainLayout;
