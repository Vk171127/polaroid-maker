import { Link } from "react-router";

const Navbar = () => {
  return (
    <header className="sticky top-0 z-10 border-b border-violet/15 bg-paper/90 backdrop-blur-md">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-5 py-4 sm:px-8" aria-label="Main navigation">
        <Link to="/" className="flex items-center gap-2 text-plum">
          <span className="flex size-9 items-center justify-center rounded-2xl bg-lavender text-lg shadow-sm">ET</span>
          <span className="font-semibold tracking-tight">Elf&apos;n Tales</span>
        </Link>
        <ul className="flex items-center gap-5 text-sm font-medium text-plum/70">
          <li><Link className="transition-colors hover:text-plum" to="/">Create</Link></li>
          <li><Link className="transition-colors hover:text-plum" to="/about">Our story</Link></li>
          <li><Link className="rounded-full bg-plum px-4 py-2 text-paper transition-transform hover:-translate-y-0.5" to="/admin/login">Login</Link></li>
        </ul>
      </nav>
    </header>
  );
};

export default Navbar;
