import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const AuthGuard = ({ children, required }) => {
  const navigate = useNavigate();

  useEffect(() => {
    const loginData = JSON.parse(localStorage.getItem("loginData"));

    if (required && !loginData) {
     
      navigate("/login");
    } else if (!required && loginData) {
     
      navigate("/dashboard");
    }
  }, [navigate, required]);

  return children;
};

export default AuthGuard;