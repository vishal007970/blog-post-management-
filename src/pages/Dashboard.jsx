import { useEffect, useState } from "react";
import { FaPlus, FaStar } from "react-icons/fa";
import { MdDelete, MdEdit } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Navbar from "../component/Navbar";
import "./Dashboard.css";

const Dashboard = () => {
  const navigate = useNavigate();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [favorites, setFavorites] = useState([]); 

  const handleCreatePostClick = () => {
    navigate("/create-post");
  };

  const handleEditPost = (post) => {
    navigate(`/edit-post/${post.id}`);
  };

  const handleReadMore = (post) => {
    navigate(`/post/${post.id}`);
  };

  const fetchPosts = async () => {
    try {
      setLoading(true);
      const response = await fetch("http://localhost:3000/posts");
      const data = await response.json();
      setPosts(data);
    } catch (error) {
      console.error("Error fetching posts:", error);
      toast.error("Failed to fetch posts");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
    // Load favorites from localStorage on component mount
    const savedFavorites = JSON.parse(localStorage.getItem('favorites') || '[]');
    setFavorites(savedFavorites);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("loginData");
    toast.success("Logged out successfully");
    navigate("/login");
  };

  const handleDeletePost = async (id) => {
    if (window.confirm("Are you sure you want to delete this post?")) {
      try {
        await fetch(`http://localhost:3000/posts/${id}`, {
          method: "DELETE",
        });
        setPosts(posts.filter((post) => post.id !== id));
        toast.success("Post deleted successfully");
      } catch (error) {
        console.error("Error deleting post:", error);
        toast.error("Failed to delete post");
      }
    }
  };

  // Updated toggle favorite function with localStorage
  const handleToggleFavorite = (e, postId) => {
    e.stopPropagation(); // Prevent event bubbling
    
    let newFavorites;
    if (favorites.includes(postId)) {
      newFavorites = favorites.filter(id => id !== postId);
      toast.info("Removed from favorites");
    } else {
      newFavorites = [...favorites, postId];
      toast.success("Added to favorites");
    }
    
    setFavorites(newFavorites);
    localStorage.setItem('favorites', JSON.stringify(newFavorites));
  };

  // Add image error handler
  const handleImageError = (e) => {
    e.target.src = 'https://via.placeholder.com/300x200?text=No+Image';
  };

  // Fixed: Safely parse localStorage data
  const loginData = (() => {
    try {
      return JSON.parse(localStorage.getItem("loginData") || "{}");
    } catch {
      return {};
    }
  })();

  const authData = (() => {
    try {
      const data = localStorage.getItem("authData");
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  })();

  let currentUser = "";

  if (loginData?.email) {
    // Fixed: Check if authData is an array before using find
    if (Array.isArray(authData)) {
      const foundUser = authData.find((user) => user.email === loginData.email);
      currentUser = foundUser?.username || loginData.email.split("@")[0];
    } else {
      // If authData is not an array, use email username as fallback
      currentUser = loginData.email.split("@")[0];
    }
  }

  // Fixed: Safely filter posts
  const totalPosts = posts.length;
  const userPosts = posts.filter((post) => {
    if (!currentUser) return false;
    const postAuthor = (post.author || "").toLowerCase().trim();
    const currentUserLower = currentUser.toLowerCase().trim();
    return postAuthor === currentUserLower;
  }).length;
  const communityPosts = totalPosts - userPosts;

  return (
    <div className="dashboard-page">
      <Navbar onLogout={handleLogout} />

      <main className="dashboard-main">
        <div className="dashboard-welcome">
          <div className="welcome-text">
            <h1>Welcome to Your Dashboard!</h1>
            <p>
              Manage your posts, track engagement, and connect with your
              audience.
            </p>
          </div>
        </div>

        <div className="dashboard-stats-overview">
          <div className="dash-card">
            <h3>Total Posts</h3>
            <span className="dash-number">{totalPosts}</span>
          </div>
          <div className="dash-card">
            <h3>Your Stories</h3>
            <span className="dash-number">{userPosts}</span>
          </div>
          <div className="dash-card">
            <h3>Community Posts</h3>
            <span className="dash-number">{communityPosts}</span>
          </div>
        </div>

        <section className="posts-section">
          <div className="section-header">
            <h2 className="section-title">Recent Feed</h2>
            <button
              className="create-shortcut-btn"
              onClick={handleCreatePostClick}
            >
              <FaPlus /> New Post
            </button>
          </div>

          <div className="posts-grid">
            {loading ? (
              <div className="loading-spinner">Loading posts...</div>
            ) : posts.length > 0 ? (
              posts.map((post) => (
                <div className="post-card" key={post.id}>
                  <div className="post-image-container">
                    <img
                      src={post.image || 'https://via.placeholder.com/300x200?text=No+Image'}
                      alt={post.title}
                      className="post-card-image"
                      onError={handleImageError}
                    />
                    <button 
                      className={`favorite-btn ${favorites.includes(post.id) ? 'active' : ''}`}
                      onClick={(e) => handleToggleFavorite(e, post.id)}
                    >
                      <FaStar size={20} color={favorites.includes(post.id) ? "#FFD700" : "#ffffff"} />
                    </button>
                    <div className="post-actions">
                      <button
                        className="action-btn edit-btn"
                        title="Edit Post"
                        onClick={() => handleEditPost(post)}
                      >
                        <MdEdit size={22} color="#ffffff" />
                      </button>
                      <button
                        className="action-btn delete-btn"
                        title="Delete Post"
                        onClick={() => handleDeletePost(post.id)}
                      >
                        <MdDelete size={20} color="#ffffff" />
                      </button>
                    </div>
                  </div>
                  <div className="post-card-content">
                    <div className="post-meta">
                      <span className="post-author">
                        By {post.author || "Anonymous"}
                      </span>
                      <span className="post-date">
                        {post.date ||
                          new Date(
                            post.createdAt || Date.now(),
                          ).toLocaleDateString()}
                      </span>
                    </div>
                    <h3 className="post-card-title">{post.title}</h3>
                    <p className="post-card-description">{post.description}</p>
                    <button
                      className="read-more-btn"
                      onClick={() => handleReadMore(post)}
                    >
                      Read More
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="no-posts">
                <p>No posts yet. Be the first to create a post!</p>
              </div>
            )}
          </div>
        </section>
      </main>
    </div>
  );
};

export default Dashboard;