import { Link } from "react-router";

const NotFound = () => {
  return (
    <div className="flex min-h-[70dvh] flex-col items-center justify-center gap-3 px-6 text-center">
      <span className="text-4xl">🧭</span>
      <h1 className="text-lg font-semibold text-ink">Page not found</h1>
      <p className="text-sm text-ink/50">
        This page wandered off. Let&apos;s get you back.
      </p>
      <Link
        to="/"
        className="mt-2 rounded-full bg-plum px-5 py-2.5 text-sm font-semibold text-white"
      >
        Back to home
      </Link>
    </div>
  );
};

export default NotFound;
