import Header from "./Movies/Header";
import MoviesContainerPage from "./Movies/MoviesContainerPage";

const Home = () => {
  return (
    <>
      <Header />

      <section className="mt-[6rem] bg-[#121212] px-4 py-10 min-h-screen">
  <MoviesContainerPage />
</section>


    </>
  );
};

export default Home;
