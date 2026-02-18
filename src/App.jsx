// src/App.jsx
import {
  createBrowserRouter,
  Navigate,
  RouterProvider,
} from "react-router-dom";
import "./App.css";

import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import AuthGuard from "./auth/AuthGuard";
import CreatePost from "./pages/CreatePost.jsx";
import PostDetails from "./pages/PostDetails.jsx";
import Analytics from "./pages/Analytics.jsx";
import { ThemeProvider } from "./context/ThemeContext";

// Default redirect
const DefaultRoute = () => {
  const storedData = localStorage.getItem("loginData");
  const loginData = storedData ? JSON.parse(storedData) : null;

  return loginData ? (
    <Navigate to="/dashboard" replace />
  ) : (
    <Navigate to="/login" replace />
  );
};

function App() {
  const route = createBrowserRouter([
    {
      path: "/",
      element: <DefaultRoute />,
    },

    {
      path: "/login",
      element: (
        <AuthGuard required={false}>
          <Login />
        </AuthGuard>
      ),
    },

    {
      path: "/register",
      element: (
        <AuthGuard required={false}>
          <Register />
        </AuthGuard>
      ),
    },

    {
      path: "/dashboard",
      element: (
        <AuthGuard required={true}>
          <Dashboard />
        </AuthGuard>
      ),
    },
    {
      path: "/create-post",  // Changed from "/createpost" to match navigation
      element: (
        <AuthGuard required={true}>
          <CreatePost />
        </AuthGuard>
      ),
    },
    {
      path: "/edit-post/:id",
      element: (
        <AuthGuard required={true}>
          <CreatePost />
        </AuthGuard>
      )
    },
    {
      path: "/analytics",
      element: (
        <AuthGuard required={true}>
          <Analytics />
        </AuthGuard>
      ),
    },
    {
      path: "/post/:id",  // Changed from "/postdetails/:id" to match navigation
      element: (
        <AuthGuard required={true}>
          <PostDetails />
        </AuthGuard>
      ),
    },
    {
      path: "*",
      element: (
        <div style={{ textAlign: "center", padding: "100px" }}>
          <h1>404 - Page Not Found</h1>
          <p>The page you are looking for does not exist.</p>
        </div>
      ),
    },
  ]);

  return(
<ThemeProvider>
  <RouterProvider router={route }/>
</ThemeProvider>
  );
}

export default App;