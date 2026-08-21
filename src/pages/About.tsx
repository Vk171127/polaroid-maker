import MakerBurst from "@/components/MakerBurst";

// Everything the stall makes — the burst above only has room to show a
// handful as "arms", this list keeps the full range visible.
const allCrafts = [
  "Charm bracelets",
  "Phone charms",
  "Bookmarks",
  "Earrings",
  "Resin art & keychains",
  "Custom birthday gifts",
  "Bouquets",
  "Mystery boxes",
  "Photo keychains",
  "Preserved flowers",
  "Anklets",
  "Scrunchies",
  "Clay keychains",
  "Flower bouquet keychains",
  "Invitations",
  "Journal designs",
];

// TODO: swap these placeholder tiles for real product photos, and
// point the "Follow us" button at the actual Instagram handle.
const instagramHandle = "elfntales"; // <-- replace with the real handle
const instagramPreview = ["🔗", "🌸", "📓", "💐", "✨", "🎀"];

const About = () => {
  return (
    <div className="flex flex-col gap-12 px-6 pb-16 pt-14">
      {/* Hero: the maker burst */}
      <section className="flex flex-col items-center gap-5 text-center">
        <MakerBurst />
        <div className="flex flex-col items-center gap-1">
          <span className="font-script text-4xl text-plum">
            Elf &apos;n Tales
          </span>
          <p className="text-xs font-semibold uppercase tracking-[0.15em] text-ink/40">
            The little elf&apos;s magic touch
          </p>
        </div>
        <p className="max-w-xs text-sm leading-relaxed text-ink/60">
          One small stall, one big imagination. Every piece here is made by
          hand, on the spot, exactly the way you picture it.
        </p>
      </section>

      {/* Personalization note */}
      <section className="rounded-2xl bg-plum-light/50 p-5 text-center">
        <p className="text-sm leading-relaxed text-ink/70">
          Pick your own charms for a bracelet, get your initials on a resin
          keychain, or turn a favorite photo into something you can carry. Most
          pieces are customized right there at the stall, while you wait.
        </p>
      </section>

      {/* Full craft list */}
      <section>
        <h2 className="mb-4 text-center text-xs font-semibold uppercase tracking-[0.15em] text-ink/40">
          Everything we make
        </h2>
        <div className="flex flex-wrap justify-center gap-2">
          {allCrafts.map((craft) => (
            <span
              key={craft}
              className="rounded-full border border-line bg-white px-3 py-1.5 text-xs font-medium text-ink/70"
            >
              {craft}
            </span>
          ))}
        </div>
      </section>

      {/* Instagram */}
      <section className="flex flex-col items-center gap-4">
        <h2 className="text-xs font-semibold uppercase tracking-[0.15em] text-ink/40">
          Follow the making
        </h2>
        <div className="grid w-full max-w-sm grid-cols-3 gap-2">
          {instagramPreview.map((emoji, i) => (
            <div
              key={i}
              className="flex aspect-square items-center justify-center rounded-xl bg-lavender-light text-2xl"
            >
              {emoji}
            </div>
          ))}
        </div>
        <a
          href={`https://instagram.com/${instagramHandle}`}
          target="_blank"
          rel="noreferrer"
          className="rounded-full bg-plum px-5 py-2.5 text-sm font-semibold text-white"
        >
          Follow @{instagramHandle}
        </a>
      </section>
    </div>
  );
};

export default About;
