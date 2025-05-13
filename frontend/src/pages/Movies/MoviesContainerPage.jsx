import { useState } from "react";
import {
  useGetNewMoviesQuery,
  useGetTopMoviesQuery,
  useGetRandomMoviesQuery,
} from "../../redux/api/movies";

import { useFetchGenresQuery } from "../../redux/api/genre";
import SliderUtil from "../../component/SliderUtil";

const MoviesContainerPage = () => {
  const { data } = useGetNewMoviesQuery();
  const { data: topMovies } = useGetTopMoviesQuery();
  const { data: genres } = useFetchGenresQuery();
  const { data: randomMovies } = useGetRandomMoviesQuery();

  const [selectedGenre, setSelectedGenre] = useState(null);

  const handleGenreClick = (genreId) => {
    setSelectedGenre(genreId);
  };

  const filteredMovies = Array.from(
    new Map(
      data
        ?.filter(
          (movie) =>
            selectedGenre === null ||
            (Array.isArray(movie.genre)
              ? movie.genre.includes(selectedGenre)
              : movie.genre === selectedGenre)
        )
        .map((movie) => [movie._id, movie]) // Assumes _id is unique
    ).values()
  );
  
  
  return (
    <div className="flex flex-col lg:flex-row gap-10 items-start px-6">
  {/* Genre Filter */}
  <nav className="flex flex-wrap lg:flex-col gap-2 sticky top-20">
    {genres?.map((g) => (
      <button
        key={g._id}
        className={`px-4 py-2 rounded-full text-sm font-medium transition shadow ${
          selectedGenre === g._id
            ? "bg-teal-600 text-white"
            : "bg-zinc-700 text-gray-300 hover:bg-zinc-600"
        }`}
        onClick={() => handleGenreClick(g._id)}
      >
        {g.name}
      </button>
    ))}
  </nav>

  {/* Movie Sliders */}
  <section className="flex flex-col gap-12 w-full">
    <div>
      <h2 className="text-xl font-semibold mb-4 text-white">Recommended for You</h2>
      <SliderUtil data={randomMovies} />
    </div>

    <div>
      <h2 className="text-xl font-semibold mb-4 text-white">Top Movies</h2>
      <SliderUtil data={topMovies} />
    </div>

    <div>
      <h2 className="text-xl font-semibold mb-4 text-white">Browse by Genre</h2>
      <SliderUtil data={filteredMovies} />
    </div>
  </section>
</div>

  );
};

export default MoviesContainerPage;