import SliderUtil from "../../component/SliderUtil";
import { useGetNewMoviesQuery } from "../../redux/api/movies";
import { Link } from "react-router-dom";

const Header = () => {
  const { data } = useGetNewMoviesQuery();

  return (
    <div className="flex flex-col md:flex-row items-center justify-between px-6 py-8 bg-zinc-900 shadow-lg rounded-md mx-4 mt-6">
    <nav className="flex flex-col space-y-3 w-full md:w-auto">
      <Link
        to="/"
        className="text-lg text-gray-300 hover:text-teal-400 transition"
      >
        Home
      </Link>
      <Link
        to="/movies"
        className="text-lg text-gray-300 hover:text-teal-400 transition"
      >
        Browse Movies
      </Link>
    </nav>
  
    <div className="w-full md:w-[75%] mt-6 md:mt-0">
      <h2 className="text-2xl font-semibold mb-4 text-gray-100 text-center md:text-left">
        What's New
      </h2>
      <SliderUtil data={data} />
    </div>
  </div>
  
  );
};

export default Header;