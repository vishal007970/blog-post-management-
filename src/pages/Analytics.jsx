// import React from "react";

// import {
//   BarChart,
//   Bar,
//   XAxis,
//   YAxis,
//   CartesianGrid,
//   Tooltip,
//   Legend,
//   ResponsiveContainer,
//   PieChart,
//   Pie,
//   Cell
// } from "recharts";

import {
    Bar,
    BarChart,
    CartesianGrid,
    Cell,
    Legend,
    Pie,
    PieChart,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
  } from "recharts";
  import { useState, useEffect } from "react";
  import Navbar from "../component/Navbar";
  
  import "./Analytics.css";
  import { useNavigate } from "react-router-dom";
  
  
  
  const Analytics = () => {
  const navigate = useNavigate(); 
  const handleEdit = (id) => {
    navigate(`/edit-post/${id}`);
  };
  
  
  
  
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const postsPerPage = 5;
  
    
  
    const authorStats = posts.reduce((acc, post) => {
    const author = post.author || "Unknown";
    acc[author] = (acc[author] || 0) + 1;
    return acc;
  }, {});
  
  const chartData = Object.keys(authorStats).map((author) => ({
    name: author,
    posts: authorStats[author],
  }));
  
  
    const indexOfLastPost = currentPage * postsPerPage;
    const indexOfFirstPost = indexOfLastPost - postsPerPage;
    const currentPosts = posts.slice(indexOfFirstPost, indexOfLastPost);
    const TotalPages = Math.ceil(posts.length / postsPerPage);
    const paginate = (pageNumber) => setCurrentPage(pageNumber);
  
    const fetchPosts = async () => {
      try {
        setLoading(true);
        const response = await fetch("http://localhost:5000/posts");
        const data = await response.json();
        setPosts(data);
      } catch (error) {
        console.error("Error fetching posts:", error);
      } finally {
        setLoading(false);
      }
    };
  
    useEffect(() => {
      fetchPosts();
    }, []);
  
  
  //   const chartData = posts.reduce((acc, post) => {
  //     const existingAuthor = acc.find((item) => item.name === post.author);
  //     if (existingAuthor) {
  //       existingAuthor.posts += 1;
  //     } else {
  //       acc.push({ name: post.author, posts: 1 });
  //     }
  //     return acc;
  //   }, []);
  
    const header = ["ID", "Title", "Author", "Date","Actions"];
    const COLORS = [
      "#0088FE",
      "#00C49F",
      "#FFBB28",
      "#FF8042",
      "#8884d8",
      "#82ca9d",
    ];
  
    if (loading) {
      return (
        <div className="analytics-page">
          <Navbar />
          <main className="analytics-main">
            <div className="loading">Loading...</div>
          </main>
        </div>
      );
    }
  
    const handleDelete = async (id) => {
    if (!window.confirm("Delete this post?")) return;
  
    try {
      await fetch(`http://localhost:5000/posts/${id}`, {
        method: "DELETE",
      });
  
      setPosts(posts.filter((post) => post.id !== id));
    } catch (error) {
      console.log("Delete error:", error);
    }
  };
  
    return (
      <div className="analytics-page">
        <Navbar />
        <main className="analytics-main">
          <header className="analytics-header">
            <h1>Blog Analytics</h1>
            <p>Insights into your blog's performance and activity.</p>
          </header>
  
          <div className="charts-container">
            <div className="chart-card">
              <h3>Posts per Author</h3>
              <div className="chart-wrapper">
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="posts" fill="#8884d8" name="Number of Posts" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
  
            <div className="chart-card">
              <h3>Distribution</h3>
              <div className="chart-wrapper">
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={chartData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({name,percent})=>`${name} ${(percent *100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="posts"
                    >
                      {chartData.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={COLORS[index % COLORS.length]}
                        />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
  
          <div className="posts-table-section">
            <h3>All Posts</h3>
            <div className="table-wrapper">
              <table className="analytics-table">
                <thead>
                  <tr>
                    {header.map((headerItem, index) => (
                      <th key={index}>{headerItem}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
    {currentPosts.length > 0 ? (
      currentPosts.map((post) => (
        <tr key={post.id}>
          <td>{post.id}</td>
          <td>{post.title}</td>
          <td>{post.author}</td>
        <td>{post.createdAt || post.date}</td>
  
         
         <td className="action-buttons" 
         >
          <button className="edit-btn"
           onClick={()=>handleEdit(post.id)}
           title="Edit"
           >
              ✏️
           </button>
  
    <button className="delete-btn"
           onClick={()=>handleDelete(post.id)}
           title="Delete"
           >
              🗑️
           </button>
  
         </td>
        </tr>
      ))
    ) : (
      <tr>
        <td colSpan="4" style={{ textAlign: "center" }}>
          No posts found
        </td>
      </tr>
    )}
  </tbody>
  
              </table>
            </div>
  
            <div className="pagination">
              <button
                className="page-btn"
                onClick={() => paginate(currentPage - 1)}
                disabled={currentPage === 1}
              >
                Previous
              </button>
              {[...Array(TotalPages).keys()].map((number) => (
                <button
                  key={number + 1}
                  onClick={() => paginate(number + 1)}
                  className={`page-btn ${currentPage === number + 1 ? "active" : ""}`}
                >
                  {number + 1}
                </button>
              ))}
           
              <button
                className="page-btn"
                onClick={() => paginate(currentPage + 1)}
                disabled={currentPage === TotalPages}
              >
                Next
              </button>
            </div>
          </div>
        </main>
      </div>
    );
  };
  export default Analytics;