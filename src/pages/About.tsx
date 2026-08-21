import MakerBurst from "@/components/MakerBurst";
import p1 from "@/assets/p1.jpeg";
import p3 from "@/assets/p3.jpeg";
import p4 from "@/assets/p4.jpeg";
import p6 from "@/assets/p6.jpeg";
import p7 from "@/assets/p7.jpeg";
import p9 from "@/assets/p9.jpeg";

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

const instagramHandle = "elfntales";
const instagramPreview = [
  { src: p1, alt: "Stacked beaded bracelets with jelly and crackle beads" },
  { src: p3, alt: "Handmade explosion gift box with love-themed inserts" },
  { src: p4, alt: "Silver charm bracelet with bird and floral charms" },
  { src: p6, alt: "Iridescent fabric scrunchie" },
  { src: p7, alt: "Black and blue crackle bead bracelet set with charms" },
  { src: p9, alt: "Customised beaded hair clips" },
];

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
        <p className="font-serif text-lg italic text-plum">
          You Dream We Craft
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
          {instagramPreview.map((item, i) => (
            <div
              key={i}
              className="aspect-square overflow-hidden rounded-xl bg-lavender-light"
            >
              <img
                src={item.src}
                alt={item.alt}
                className="h-full w-full object-cover"
                loading="lazy"
              />
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
