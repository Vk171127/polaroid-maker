import LayoutSelector from "@/components/LayoutSelector";

const Home = () => {
  return (
    <section className="mx-auto flex max-w-6xl flex-col gap-10 px-5 py-10 sm:px-8 sm:py-16">
      <div className="animate-float-in max-w-3xl">
        <p className="mb-4 inline-flex rounded-full bg-butter px-4 py-2 text-xs font-bold uppercase tracking-[0.18em] text-plum">Little keepsakes, made magical</p>
        <h1 className="max-w-2xl text-balance text-4xl font-black tracking-tight text-plum sm:text-6xl">Turn your favourite moments into tiny treasures.</h1>
        <p className="mt-5 max-w-xl text-pretty text-base leading-7 text-plum/65 sm:text-lg">Choose a layout, add your photos, and let our little studio make something you&apos;ll want to keep close.</p>
      </div>
      <LayoutSelector />
    </section>
  );
};

export default Home;
