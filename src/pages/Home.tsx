import LayoutSelector from "@/components/LayoutSelector";

const Home = () => {
  return (
    <>
      <div className="text-2xl gap-y-2 items-center flex flex-col text-center ">
        Welcome to Polaroid Corner
        <LayoutSelector />
      </div>
    </>
  );
};

export default Home;
