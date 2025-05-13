import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  useCreateMovieMutation,
  useUploadImageMutation,
} from "../../redux/api/movies";
import { useFetchGenresQuery } from "../../redux/api/genre";
import { toast } from "react-toastify";

const CreateMovie = () => {
  const navigate = useNavigate();

  const [movieData, setMovieData] = useState({
    name: "",
    year: 0,
    detail: "",
    cast: [],
    rating: 0,
    image: null,
    genre: "",
  });

  const [selectedImage, setSelectedImage] = useState(null);
  const [selectedGenre, setSelectedGenre] = useState("");

  const [
    createMovie,
    { isLoading: isCreatingMovie, error: createMovieErrorDetail },
  ] = useCreateMovieMutation();

  const [
    uploadImage,
    { isLoading: isUploadingImage, error: uploadImageErrorDetails },
  ] = useUploadImageMutation();

  const { data: genres, isLoading: isLoadingGenres } = useFetchGenresQuery();

  useEffect(() => {
    if (genres) {
      const defaultGenreId = genres[0]?._id || "";
      setMovieData((prevData) => ({
        ...prevData,
        genre: defaultGenreId,
      }));
      setSelectedGenre(defaultGenreId);
    }
  }, [genres]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "genre") {
      setMovieData((prevData) => ({
        ...prevData,
        genre: value,
      }));
      setSelectedGenre(value);
    } else {
      setMovieData((prevData) => ({
        ...prevData,
        [name]: value,
      }));
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setSelectedImage(file);
  };

  const handleCreateMovie = async () => {
    try {
      let uploadedImagePath = "/uploads/default-movie.jpg";

      if (selectedImage) {
        const formData = new FormData();
        formData.append("image", selectedImage);

        const uploadImageResponse = await uploadImage(formData);

        if (uploadImageResponse.error) {
          console.error("❌ Upload failed:", uploadImageResponse.error);
          toast.error("Upload failed");
        }

        if (uploadImageResponse.data?.image) {
          uploadedImagePath = uploadImageResponse.data.image;
        }
      }

      const payload = {
        name: movieData.name || "Untitled Movie",
        year: movieData.year || new Date().getFullYear(),
        detail: movieData.detail || "No description provided.",
        cast: movieData.cast.length > 0 ? movieData.cast : ["Unknown Cast"],
        rating: movieData.rating || 0,
        genre: movieData.genre || genres[0]?._id || "",
        image: uploadedImagePath,
      };

      const response = await createMovie(payload);

      if (response.error) {
        toast.error("Failed to create movie.");
        console.error("API Error:", response.error);
        return;
      }

      toast.success("Movie Added To Database");
      navigate("/admin/movies-list");

      setMovieData({
        name: "",
        year: 0,
        detail: "",
        cast: [],
        rating: 0,
        image: null,
        genre: genres[0]?._id || "",
      });
      setSelectedImage(null);
      setSelectedGenre(genres[0]?._id || "");
    } catch (error) {
      console.error("Unexpected Error:", error);
      toast.error("Something went wrong while creating the movie.");
    }
  };

  const selectedGenreName = genres?.find((g) => g._id === selectedGenre)?.name;

  return (
    <div className="container flex justify-center items-center mt-4">
      <form>
        <p className="text-green-200 w-[50rem] text-2xl mb-4">Create Movie</p>
        <div className="mb-4">
          <label className="block">
            Name:
            <input
              type="text"
              name="name"
              value={movieData.name}
              onChange={handleChange}
              className="border px-2 py-1 w-full"
            />
          </label>
        </div>
        <div className="mb-4">
          <label className="block">
            Year:
            <input
              type="number"
              name="year"
              value={movieData.year}
              onChange={handleChange}
              className="border px-2 py-1 w-full"
            />
          </label>
        </div>
        <div className="mb-4">
          <label className="block">
            Detail:
            <textarea
              name="detail"
              value={movieData.detail}
              onChange={handleChange}
              className="border px-2 py-1 w-full"
            ></textarea>
          </label>
        </div>
        <div className="mb-4">
          <label className="block">
            Cast (comma-separated):
            <input
              type="text"
              name="cast"
              value={movieData.cast.join(", ")}
              onChange={(e) =>
                setMovieData({ ...movieData, cast: e.target.value.split(", ") })
              }
              className="border px-2 py-1 w-full"
            />
          </label>
        </div>
        <div className="mb-4">
          <label className="block">
            Genre:
            <select
              name="genre"
              value={movieData.genre}
              onChange={handleChange}
              className="border px-2 py-1 w-full"
            >
              {isLoadingGenres ? (
                <option>Loading genres...</option>
              ) : (
                genres.map((genre) => (
                  <option key={genre._id} value={genre._id}>
                    {genre.name}
                  </option>
                ))
              )}
            </select>
          </label>

          {/* ✅ Show the selected genre name */}
          {selectedGenre && (
            <p className="mt-2 text-green-300">
              Selected Genre: <strong>{selectedGenreName}</strong>
            </p>
          )}
        </div>

        <div className="mb-4">
          <label
            style={
              !selectedImage
                ? {
                    border: "1px solid #888",
                    borderRadius: "5px",
                    padding: "8px",
                  }
                : {
                    border: "0",
                    borderRadius: "0",
                    padding: "0",
                  }
            }
          >
            {!selectedImage && "Upload Image"}
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              style={{ display: !selectedImage ? "none" : "block" }}
            />
          </label>
        </div>

        <button
          type="button"
          onClick={handleCreateMovie}
          className="bg-teal-500 text-white px-4 py-2 rounded"
          disabled={isCreatingMovie || isUploadingImage}
        >
          {isCreatingMovie || isUploadingImage ? "Creating..." : "Create Movie"}
        </button>
      </form>
    </div>
  );
};

export default CreateMovie;
