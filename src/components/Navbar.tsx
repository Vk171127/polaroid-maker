import { Link } from "react-router";

const Navbar = () => {
  return (
    <nav className="flex p-2 gap-2 justify-between items-center bg-pink-500 text-white">
      <Link to="/">📸</Link>
      <ul className="flex space-x-4">
        <Link to="/">Home</Link>
        <Link to="/about">About</Link>
      </ul>
      <Link to="/admin/login">Login</Link>
    </nav>
  );
};

export default Navbar;
