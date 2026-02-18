
// src/pages/Dashboard.jsx
import { useEffect, useState } from "react";
import { FaPlus } from "react-icons/fa";
import { MdDelete, MdEdit } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Navbar from "../component/Navbar";
import "./Dashboard.css";
 // Same path as CreatePost

// ... rest of your Dashboard.jsx code remains the same

const Dashboard = () => {
  const navigate = useNavigate();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  const handleCreatePostClick = () => {
    navigate("/create-post");  // Fixed to match route
  };

  const handleEditPost = (post) => {
    navigate(`/edit-post/${post.id}`);
  };

  const handleReadMore = (post) => {
    navigate(`/post/${post.id}`);  // Fixed to match route
  };

  const fetchPosts = async () => {
    try {
      setLoading(true);
      const response = await fetch("http://localhost:5000/posts");  // Changed port to 5000 to match CreatePost
      const data = await response.json();
      setPosts(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Error fetching posts:", error);
      toast.error("Failed to fetch posts");
      setPosts([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("loginData");
    toast.success("Logged out successfully");
    navigate("/login");
  };

  const handleDeletePost = async (id) => {
    if (window.confirm("Are you sure you want to delete this post?")) {
      try {
        await fetch(`http://localhost:5000/posts/${id}`, {  // Changed port to 5000
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

  const loginData = JSON.parse(localStorage.getItem("loginData") || "{}");
  
  let authData = [];
  try {
    const storedAuth = localStorage.getItem("authData");
    if (storedAuth) {
      const parsed = JSON.parse(storedAuth);
      authData = Array.isArray(parsed) ? parsed : [];
    }
  } catch (error) {
    console.error("Error parsing authData:", error);
    authData = [];
  }

  let currentUser = "";

  if (loginData?.email) {
    const foundUser = Array.isArray(authData) 
      ? authData.find((user) => user && user.email === loginData.email)
      : null;
    currentUser = foundUser?.username || loginData.email.split("@")[0];
  }

  const totalPosts = Array.isArray(posts) ? posts.length : 0;
  
  const userPosts = Array.isArray(posts) && currentUser
    ? posts.filter((post) => {
        if (!post || !post.author) return false;
        const postAuthor = post.author.toLowerCase().trim();
        const currentUserLower = currentUser.toLowerCase().trim();
        return postAuthor === currentUserLower;
      }).length
    : 0;
    
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
            ) : Array.isArray(posts) && posts.length > 0 ? (
              posts.map((post) => (
                <div className="post-card" key={post?.id || Math.random()}>
                  <div className="post-image-container">
                    <img
                      src={post?.image || "https://via.placeholder.com/300"}
                      alt={post?.title || "Post image"}
                      className="post-card-image"
                      onError={(e) => {
                        e.target.src = "https://via.placeholder.com/300";
                      }}
                    />
                    <div className="post-actions">
                      <button
                        className="action-btn edit-btn"
                        title="Edit Post"
                        onClick={() => post?.id && handleEditPost(post)}
                      >
                        <MdEdit size={22} color="#ffffff" />
                      </button>
                      <button
                        className="action-btn delete-btn"
                        title="Delete Post"
                        onClick={() => post?.id && handleDeletePost(post.id)}
                      >
                        <MdDelete size={20} color="#ffffff" />
                      </button>
                    </div>
                  </div>
                  <div className="post-card-content">
                    <div className="post-meta">
                      <span className="post-author">
                        By {post?.author || "Anonymous"}
                      </span>
                      <span className="post-date">
                        {post?.date ||
                          (post?.createdAt 
                            ? new Date(post.createdAt).toLocaleDateString()
                            : new Date().toLocaleDateString())}
                      </span>
                    </div>
                    <h3 className="post-card-title">{post?.title || "Untitled"}</h3>
                    <p className="post-card-description">{post?.description || "No description available"}</p>
                    <button
                      className="read-more-btn"
                      onClick={() => post?.id && handleReadMore(post)}
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