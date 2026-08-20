import { Link, useLocation } from "react-router";

const Navbar = () => {
  const { pathname } = useLocation();

  const linkClass = (path: string) =>
    `text-sm font-medium transition-colors ${
      pathname === path ? "text-plum" : "text-ink/50 hover:text-ink/80"
    }`;

  return (
    <nav className="sticky top-0 z-30 flex items-center justify-between border-b border-line bg-paper/90 px-5 py-3 backdrop-blur-sm">
      <Link to="/" className="font-script text-3xl leading-none text-plum">
        Elf &apos;n Tales
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
