// src/pages/CreatePost.jsx

import React, { useState, useEffect, useRef } from "react";
import "./CreatePost.css";
import { useNavigate, useParams } from "react-router-dom";
import Navbar from "../component/Navbar";
import {
  FaHeading,
  FaUser,
  FaLink,
  FaCloudUploadAlt,
  FaTimes,
  FaRegPaperPlane,
} from "react-icons/fa";

const CreatePost = ({ authData, name }) => {
  const navigate = useNavigate();
  const { id } = useParams();

  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);
  const fileInput = useRef(null);

  const [postData, setPostData] = useState({
    title: "",
    author: authData ? name : "",
    description: "",
    imageUrl: "",
    imageType: "url",
  });

  // Handle input change
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setPostData((prev) => ({ ...prev, [name]: value }));
  };

  // Switch image type
  const changeImageType = (type) => {
    setPostData((prev) => ({ ...prev, imageType: type }));
    setImagePreview(type === "url" ? postData.imageUrl : null);
  };

  // Handle image URL
  const handleImageUrl = (e) => {
    const url = e.target.value;
    setPostData((prev) => ({ ...prev, imageUrl: url }));
    setImagePreview(url);
  };

  // Handle file upload
  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => setImagePreview(reader.result);
    reader.readAsDataURL(file);
  };

  // Remove image
  const removeImage = () => {
    setImagePreview(null);
    if (postData.imageType === "url") {
      setPostData((prev) => ({ ...prev, imageUrl: "" }));
    }
    if (fileInput.current) fileInput.current.value = "";
  };

  // Clear form
  const clearForm = () => {
    setPostData({
      title: "",
      author: authData ? name : "",
      description: "",
      imageUrl: "",
      imageType: "url",
    });
    setImagePreview(null);
  };

  // Fetch post if editing
  useEffect(() => {
    if (!id) {
      setIsEditing(false);
      return;
    }

    setIsEditing(true);

    const fetchPost = async () => {
      try {
        const res = await fetch(`http://localhost:5000/posts/${id}`);
        if (!res.ok) throw new Error("Failed to fetch post");

        const post = await res.json();

        setPostData({
          title: post.title || "",
          author: post.author || "",
          description: post.description || "",
          imageUrl: post.image || "",
          imageType: "url",
        });

        setImagePreview(post.image || null);
      } catch (err) {
        console.log("Error fetching post:", err);
      }
    };

    fetchPost();
  }, [id, authData, name]);

  // Submit form
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const dataToSend = {
      title: postData.title,
      author: postData.author,
      description: postData.description,
      image: imagePreview || postData.imageUrl,
      createdAt: new Date().toLocaleDateString(),
    };

    try {
      const url = isEditing
        ? `http://localhost:5000/posts/${id}`
        : "http://localhost:5000/posts";

      const method = isEditing ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(dataToSend),
      });

      if (!res.ok) throw new Error("Failed to save post");

      alert(isEditing ? "Post updated!" : "Post published!");
      navigate("/dashboard");
    } catch (err) {
      console.log("Error saving post:", err);
      alert("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />

      <div className="create-post-container">
        <header className="form-header">
          <h1>{isEditing ? "Edit Post" : "Create New Post"}</h1>
          <p>Share your thoughts and stories with the world</p>
        </header>

        <div className="post-form-card">
          <form onSubmit={handleSubmit}>
            {/* Title */}
            <div className="form-group">
              <label>Title</label>
              <div className="input-wrapper">
                <FaHeading className="input-icon" />
                <input
                  className="form-control"
                  type="text"
                  name="title"
                  value={postData.title}
                  onChange={handleInputChange}
                  placeholder="Enter title"
                  required
                />
              </div>
            </div>

            {/* Author */}
            <div className="form-group">
              <label>Author</label>
              <div className="input-wrapper">
                <FaUser className="input-icon" />
                <input
                  className="form-control"
                  type="text"
                  name="author"
                  value={postData.author}
                  onChange={handleInputChange}
                  placeholder="Your name"
                />
              </div>
            </div>

            {/* Description */}
            <div className="form-group">
              <label>Description</label>
              <textarea
                className="form-control"
                name="description"
                value={postData.description}
                onChange={handleInputChange}
                placeholder="Write something..."
                required
              ></textarea>
            </div>

            {/* Image Section */}
            <div className="form-group">
              <label>Cover Image</label>

              {!imagePreview ? (
                <>
                  <div className="image-source-tabs">
                    <button
                      type="button"
                      className={`tab-btn ${
                        postData.imageType === "url"
                          ? "tab-btn-active"
                          : ""
                      }`}
                      onClick={() => changeImageType("url")}
                    >
                      URL
                    </button>

                    <button
                      type="button"
                      className={`tab-btn ${
                        postData.imageType === "file"
                          ? "tab-btn-active"
                          : ""
                      }`}
                      onClick={() => changeImageType("file")}
                    >
                      Upload
                    </button>
                  </div>

                  {postData.imageType === "url" ? (
                    <div className="input-wrapper">
                      <FaLink className="input-icon" />
                      <input
                        className="form-control"
                        type="url"
                        value={postData.imageUrl}
                        onChange={handleImageUrl}
                        placeholder="Paste image URL"
                      />
                    </div>
                  ) : (
                    <div
                      className="image-upload-area"
                      onClick={() => fileInput.current.click()}
                    >
                      <FaCloudUploadAlt className="upload-icon" />
                      <p>Click to upload</p>
                      <input
                        type="file"
                        ref={fileInput}
                        accept="image/*"
                        onChange={handleFileUpload}
                        style={{ display: "none" }}
                      />
                    </div>
                  )}
                </>
              ) : (
                <div className="image-preview-container">
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="image-preview"
                  />
                  <button
                    type="button"
                    className="remove-image-btn"
                    onClick={removeImage}
                  >
                    <FaTimes />
                  </button>
                </div>
              )}
            </div>

            {/* Buttons */}
            <div className="form-actions-row">
              <button
                type="submit"
                className="submit-btn"
                disabled={loading}
              >
                <FaRegPaperPlane />
                {loading
                  ? isEditing
                    ? "Updating..."
                    : "Publishing..."
                  : isEditing
                  ? "Update Post"
                  : "Publish Post"}
              </button>

              <button
                type="button"
                className="cancel-btn"
                onClick={clearForm}
              >
                Clear
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default CreatePost;
