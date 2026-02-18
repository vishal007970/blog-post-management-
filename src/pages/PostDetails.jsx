import React, { useEffect, useState } from "react";
import Navbar from "../component/Navbar";
import { FaArrowLeft, FaCalendarAlt, FaClock } from "react-icons/fa";
import "./PostDetails.css";
import { useNavigate, useParams } from "react-router-dom";

const PostDetails = () => {

  const navigate = useNavigate();
  const { id } = useParams();   // 👈 URL માંથી id લાવે
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // ==========================
  // FETCH SINGLE POST
  // ==========================
  useEffect(() => {
    fetch(`http://localhost:5000/posts/${id}`)
      .then((res) => {
        if (!res.ok) throw new Error("Post not found");
        return res.json();
      })
      .then((data) => {
        setPost(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, [id]);

  if (loading) return <p>Loading post...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;

  return (
    <div className="post-details-page">
      <Navbar />

      <main className="post-details-container">

        <button className="back-btn" onClick={() => navigate("/dashboard")}>
          <FaArrowLeft /> Back to Feed
        </button>

        <article className="full-post">

          <header className="post-header">
            <div className="post-category">Journal</div>

            <h1 className="post-full-title">{post.title}</h1>

            <div className="post-author-meta">
              <div className="author-info">

                <div className="author-avatar">
                  {post.author?.charAt(0) || "A"}
                </div>

                <div>
                  <span className="author-name">
                    {post.author || "Admin"}
                  </span>

                  <div className="post-date-row">
                    <span>
                      <FaCalendarAlt /> {post.createdAt}
                    </span>

                    <span className="dot"></span>

                    <span>
                      <FaClock /> 5 min read
                    </span>
                  </div>
                </div>

              </div>
            </div>
          </header>

          <div className="post-featured-image">
            <img src={post.image} alt={post.title} />
          </div>

          <div className="post-body">
            <p>{post.description}</p>
            <p>{post.content}</p>
          </div>

          <footer className="post-footer">
            <div className="post-share">
              <span>Share this story:</span>

              <div className="share-button">
                <button className="share-btn">Twitter</button>
                <button className="share-btn">Linkedin</button>
                <button className="share-btn">Link</button>
              </div>
            </div>
          </footer>

        </article>
      </main>
    </div>
  );
};

export default PostDetails;