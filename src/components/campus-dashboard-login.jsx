import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { useCookies } from "react-cookie";

export function Login() {
  const [user, setUser] = useState({ username: "", password: "" });
  const [cookies, setCookies] = useCookies();
  const navigate = useNavigate();

  function handleChange(e) {
    setUser({ ...user, [e.target.name]: e.target.value });
  }

  async function handleLoginClick(e) {
    e.preventDefault();

    console.log("Frontend sending:", user); // 🔥 LOG 1 (SEE WHAT IS SENT)

    try {
      const response = await axios.post(
        "https://campus-dashboard.onrender.com/login",
        {
          username: user.username,
          password: user.password,
        }
      );

      console.log("Backend response:", response.data); // 🔥 LOG 2

      setCookies("username", user.username);
      navigate("/home");
    } catch (err) {
      console.log("Login failed - backend error:", err.response?.data); // 🔥 LOG 3
      navigate("/error");
    }
  }

  return (
    <div className="parent">
      <div className="container-fluid text-center w-25 bdr">
        <h2>
          <span className="bi bi-person-fill"></span> User Login
        </h2>

        <form>
          <dl>
            <dt>User Name</dt>
            <dd>
              <input
                type="text"
                name="username"
                onChange={handleChange}
                className="form-control"
              />
            </dd>

            <dt>Password</dt>
            <dd>
              <input
                type="password"
                name="password"
                onChange={handleChange}
                className="form-control"
              />
            </dd>
          </dl>

          <button
            onClick={handleLoginClick}
            className="btn bg-info text-white w-75"
          >
            Login
          </button>
        </form>

        <Link to="/register" className="text-white text-decoration-none">
          Don't have an account? Register
        </Link>
      </div>
    </div>
  );
}
