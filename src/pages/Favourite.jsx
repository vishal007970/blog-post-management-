import React, { useEffect, useState } from "react";
import Navbar from "../component/Navbar";
import { MdOpenInNew, MdDeleteSweep, MdArrowBack } from "react-icons/md";
import { FaRegStar } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "./Favourite.css";

const Favourite = () => {
  const [posts, setPosts] = useState([]);
  const [favourites, setFavourites] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Load posts and favourites
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setLoading(true);
        const response = await fetch("http://localhost:5000/posts");
        const data = await response.json();
        setPosts(data);

        const savedFavourites = JSON.parse(localStorage.getItem('favourite') || '[]');
        setFavourites(savedFavourites);
      } catch (error) {
        console.log("Error fetching posts:", error);
        toast.error("Error loading favourites");
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  const favouritePosts = posts.filter((post) => 
    favourites.includes(String(post.id))
  );

  const handleBackToFeed = () => {
    navigate("/dashboard");
  };

  // Navigate to post details
  const handleReadMore = (postId) => {
    navigate(`/postdetails/${postId}`);
  };

  // Navigate to explore stories
  const handleExploreStories = () => {
    navigate("/dashboard");
  };

  const removeFavourite = (id, title) => {
    const updated = favourites.filter((favId) => favId !== String(id));
    setFavourites(updated);
    localStorage.setItem('favourite', JSON.stringify(updated));
    
    toast.error(`❌ Removed "${title}" from favourites`);
  };

  const clearAllFavourite = () => {
    if (favourites.length === 0) return;
    
    const confirmClear = window.confirm("Are you sure you want to clear all favourites?");
    if (!confirmClear) return;
    
    localStorage.setItem('favourite', '[]');
    setFavourites([]);
    toast.warning("🗑️ All favourites cleared");
  };

  // Format date safely
  const formatDate = (dateString) => {
    if (!dateString) return "Recent";
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return "Recent";
      return date.toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric',
        year: 'numeric'
      });
    } catch {
      return "Recent";
    }
  };

  if (loading) {
    return (
      <div className="favourite-page-container">
        <Navbar />
        <main className="favourites-main">
          <div className="loading-spinner">
            <p>Loading your favourites...</p>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="favourite-page-container">
      <Navbar />
      <main className="favourites-main">
        <div className="favourite-hero">
          <button className="back-to-feed-btn" onClick={handleBackToFeed}>
            <MdArrowBack size={20} />
            Back to Feed
          </button>
          <div className="hero-content">
            <h1>Your Reading List</h1>
            <p>Enjoy the collection of stories you've curated.</p>
          </div>
        </div>
        
        <div className="favourites-content">
          <div className="favourite-header">
            <h2>
              Curated Collection
              <span className="count-badge">{favouritePosts.length}</span>
            </h2>

            {favouritePosts.length > 0 && (
              <button className="clear-all-btn" onClick={clearAllFavourite}>
                <MdDeleteSweep size={20} />
                Clear List
              </button>
            )}
          </div>

          {favouritePosts.length === 0 ? (
            <div className="fav-empty-wrapper">
              <div className="empty-icon-wrapper">
                <FaRegStar className="empty-icon" />
              </div>
              <h3>Your List Is Empty</h3>
              <p>Discover interesting posts and save them to read later</p>
              <button className="browser-btn" onClick={handleExploreStories}>
                Explore Stories
              </button>
            </div>
          ) : (
            <div className="favourite-grid">
              {favouritePosts.map((post) => (
                <div className="fav-card" key={post.id}>
                  <div className="fav-card-image">
                    <img
                      src={post.image || "https://via.placeholder.com/300x200"}
                      alt={post.title}
                    />
                    <div className="fav-card-overlay">
                      <button 
                        className="read-btn"
                        onClick={() => handleReadMore(post.id)}
                      >
                        <MdOpenInNew /> Read Article
                      </button>
                    </div>
                  </div>
                  
                  <div className="fav-card-body">
                    <div className="fav-meta">
                      <span className="fav-author">By {post.author || "Admin"}</span>
                      <span className="fav-date">{formatDate(post.createdAt)}</span>
                    </div>
                    
                    <h3 className="fav-title">{post.title}</h3>
                    
                    <p className="fav-excerpt">
                      {post.description?.length > 100 
                        ? `${post.description.substring(0, 100)}...` 
                        : post.description}
                    </p>

                    <button 
                      className="remove-fav-btn"
                      onClick={() => removeFavourite(post.id, post.title)}
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Favourite;