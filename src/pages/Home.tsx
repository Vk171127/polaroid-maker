import LayoutSelector from "@/components/LayoutSelector";
import { Link } from "react-router";

const Home = () => {
  return (
    <div className="relative overflow-hidden">
      <div className="relative flex flex-col items-center gap-2 px-6 pt-10 pb-6 text-center">
        <span className="font-script text-2xl leading-none text-plum">
          Elf &apos;n Tales
        </span>
        <h1 className="font-serif text-4xl font-medium leading-tight text-ink">
          Turn moments into Polaroids
        </h1>
        <p className="max-w-xs text-sm leading-relaxed text-ink/60">
          Choose a layout, upload your favorite photos, and preview your
          keepsakes before they print. No account, no fuss.
        </p>
      </div>

      <div className="relative px-5 pb-8">
        <LayoutSelector />
      </div>

      <div className="relative flex justify-center px-6 pb-16">
        <Link
          to="/about"
          className="flex items-center gap-2 rounded-full border border-plum/20 bg-white px-5 py-3 text-sm font-medium text-ink/70 shadow-sm transition-colors hover:border-plum/40"
        >
          <span aria-hidden>🧵</span>
          Want to know more about Elf &apos;n Tales?
        </Link>
      </div>
    </div>
  );
};

export default Home;
