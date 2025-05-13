import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import MovieCard from "../pages/Movies/MovieCard";

const SliderUtil = ({ data }) => {
  const settings = {
    dots: true,
    infinite: data?.length > 4,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 2,
  };

  return (
    <Slider {...settings}>
  {data?.map((movie) => (
    <div className="px-2">
      <MovieCard key={movie._id} movie={movie} />
    </div>
  ))}
</Slider>

  );
};

export default SliderUtil;