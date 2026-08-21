import logo from "@/assets/logo.png";
import { Link, useLocation } from "react-router";

const Navbar = () => {
  const { pathname } = useLocation();

  const linkClass = (path: string) =>
    `text-sm font-medium transition-colors ${
      pathname === path ? "text-sunlight" : "text-white/60 hover:text-white/90"
    }`;

  return (
    <nav className="sticky top-0 z-30 flex items-center justify-between rounded-b-2xl bg-plum px-5 py-2 shadow-lg shadow-plum/30">
      <Link to="/">
        <span className="flex h-12 w-12 items-center justify-center rounded-full bg-white p-1 shadow-sm">
          <img
            src={logo}
            alt="Elf 'n Tales"
            className="h-full w-full object-contain"
          />
        </span>
      </Link>
      <ul className="flex items-center gap-4">
        <li>
          <Link to="/" className={linkClass("/")}>
            Home
          </Link>
        </li>
        <li>
          <Link to="/about" className={linkClass("/about")}>
            About
          </Link>
        </li>
      </ul>
    </nav>
  );
};

export default Navbar;
