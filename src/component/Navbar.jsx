import {
  FaBlog,
  FaHome,
  FaPlusSquare,
  FaSignOutAlt,
  FaMoon,
  FaSun,
  FaHeart,
} from "react-icons/fa";
import { NavLink, useNavigate } from "react-router-dom";
import "./Navbar.css";
import { useTheme } from "../context/ThemeContext";

const Navbar = () => {
  const navigate = useNavigate();
  const username = localStorage.getItem("username");

  const { theme, toggleTheme } = useTheme();

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <div className="navbar-logo">
          <FaBlog className="logo-icon" />
          <span className="logo-text">Blogpost</span>
        </div>

        <div className="navbar-links">
          <NavLink to="/dashboard" className="nav-item">
            <FaHome /> Home
          </NavLink>

          <NavLink to="/createpost" className="nav-item">
            <FaPlusSquare /> Create Post
          </NavLink>

          <NavLink to="/analytics" className="nav-item">
            <FaPlusSquare /> Analytics
          </NavLink>

   <NavLink to="/favourite" className="nav-item">
            <FaHeart /> Favourite
          </NavLink>

        </div>

        <div className="navbar-actions">
          <span className="user-name">Hi, {username}</span>

          <button
            className="theme-toggle-btn"
            onClick={toggleTheme}
            aria-label="Toggle theme"
          >
            {theme === "light" ? <FaMoon /> : <FaSun />}
          </button>

          <button className="logout-btn" onClick={handleLogout}>
            <FaSignOutAlt /> Logout
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;