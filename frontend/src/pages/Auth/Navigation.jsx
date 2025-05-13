import { useState } from "react";
import {
  AiOutlineHome,
  AiOutlineLogin,
  AiOutlineUserAdd,
} from "react-icons/ai";
import { MdOutlineLocalMovies } from "react-icons/md";
import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { useLogoutMutation } from "../../redux/api/users";
import { logout } from "../../redux/features/auth/authSlice";

const Navigation = () => {
  const { userInfo } = useSelector((state) => state.auth);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const toggleDropdown = () => setDropdownOpen(!dropdownOpen);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [logoutApiCall] = useLogoutMutation();

  const logoutHandler = async () => {
    try {
      await logoutApiCall().unwrap();
      dispatch(logout());
      navigate("/login");
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-50 bg-zinc-900 border border-zinc-700 w-[90%] md:w-[60%] px-8 py-4 rounded-xl shadow-lg">
      <section className="flex flex-col md:flex-row justify-between items-center gap-4">
        {/* Section 1: Navigation Links */}
        <div className="flex justify-center items-center gap-6">
          <Link
            to="/"
            className="flex items-center text-gray-300 hover:text-teal-400 transition-transform transform hover:translate-x-1"
          >
            <AiOutlineHome size={26} />
            <span className="ml-2 text-sm hidden sm:inline">Home</span>
          </Link>

          <Link
            to="/movies"
            className="flex items-center text-gray-300 hover:text-teal-400 transition-transform transform hover:translate-x-1"
          >
            <MdOutlineLocalMovies size={26} />
            <span className="ml-2 text-sm hidden sm:inline">Browse</span>
          </Link>
        </div>

        {/* Section 2: User Dropdown or Auth Links */}
        <div className="relative">
          {userInfo ? (
            <div>
              <button
                onClick={toggleDropdown}
                className="flex items-center text-gray-200 hover:text-white"
              >
                <span className="mr-2">{userInfo.username}</span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className={`h-4 w-4 transition-transform ${
                    dropdownOpen ? "rotate-180" : ""
                  }`}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d={
                      dropdownOpen ? "M5 15l7-7 7 7" : "M19 9l-7 7-7-7"
                    }
                  />
                </svg>
              </button>

              {dropdownOpen && (
                <ul className="absolute right-0 bottom-full mb-2 w-40 bg-zinc-800 border border-zinc-700 text-gray-300 rounded shadow-md py-2 z-10">
                  {userInfo.isAdmin && (
                    <li>
                      <Link
                        to="/admin/movies/dashboard"
                        className="block px-4 py-2 hover:bg-zinc-700"
                      >
                        Dashboard
                      </Link>
                    </li>
                  )}
                  <li>
                    <Link
                      to="/profile"
                      className="block px-4 py-2 hover:bg-zinc-700"
                    >
                      Profile
                    </Link>
                  </li>
                  <li>
                    <button
                      onClick={logoutHandler}
                      className="block w-full text-left px-4 py-2 hover:bg-zinc-700"
                    >
                      Logout
                    </button>
                  </li>
                </ul>
              )}
            </div>
          ) : (
            <ul className="flex gap-4">
              <li>
                <Link
                  to="/login"
                  className="flex items-center text-gray-300 hover:text-teal-400 transition-transform transform hover:translate-x-1"
                >
                  <AiOutlineLogin size={22} />
                  <span className="ml-1 text-sm hidden sm:inline">Login</span>
                </Link>
              </li>
              <li>
                <Link
                  to="/register"
                  className="flex items-center text-gray-300 hover:text-teal-400 transition-transform transform hover:translate-x-1"
                >
                  <AiOutlineUserAdd size={22} />
                  <span className="ml-1 text-sm hidden sm:inline">Register</span>
                </Link>
              </li>
            </ul>
          )}
        </div>
      </section>
    </div>
  );
};

export default Navigation;