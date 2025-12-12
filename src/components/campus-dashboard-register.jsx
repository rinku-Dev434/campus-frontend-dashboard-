import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

export function Register() {
  const navigate = useNavigate();
  const [msg, setMsg] = useState({
    username: "",
    password: "",
    gmail: "",
    mobile: "",
  });
  const [user, setUser] = useState({
    username: "",
    password: "",
    gmail: "",
    mobile: "",
  });
  const [cls, setCls] = useState("");
  const data = ["saip"];

  function handleUserNameChange(e) {
    let name = e.target.value;
    if (name.trim().length < 4) {
      setMsg({
        ...msg,
        username: "User Name too short (minimum 4 chars required)",
      });
      setUser({ ...user, username: name });
      setCls("text-danger");
    } else if (data.includes(name)) {
      setMsg({ ...msg, username: "User Name Already Taken - Try Another" });
      setUser({ ...user, username: name });
      setCls("text-danger");
    } else {
      setUser({ ...user, username: name });
      setMsg({ ...msg, username: "" });
    }
  }

  function handlePasswordChange(e) {
    const password = e.target.value;
    const strongPassword =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

    if (!strongPassword.test(password)) {
      setMsg({
        ...msg,
        password:
          "Password must be 8+ chars, include upper, lower, number & special symbol",
      });
      setUser({ ...user, password });
      setCls("text-danger");
    } else {
      setMsg({ ...msg, password: "" });
      setUser({ ...user, password });
    }
  }

  function handleEmailChange(e) {
    const gmail = e.target.value.trim();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(gmail)) {
      setMsg({
        ...msg,
        gmail: "Invalid gmail format (e.g., user@example.com)",
      });
      setUser({ ...user, gmail });
      setCls("text-danger");
    } else {
      setMsg({ ...msg, gmail: "" });
      setUser({ ...user, gmail });
    }
  }

  function handleMobileChange(e) {
    const mobile = e.target.value.trim();
    const mobileRegex = /^[6-9]\d{9}$/;

    if (!mobileRegex.test(mobile)) {
      setMsg({
        ...msg,
        mobile: "Invalid mobile number (must be 10 digits starting from 6–9)",
      });
      setUser({ ...user, mobile });
      setCls("text-danger");
    } else {
      setMsg({ ...msg, mobile: "" });
      setUser({ ...user, mobile });
    }
  }

  function sentenceCase(str) {
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
  }

  function handleBlur(e) {
    const value = e.target.value.trim();
    const field = e.target.name;

    if (value.length === 0) {
      setMsg({ ...msg, [field]: `${sentenceCase(field)} required` });
      setCls("text-danger");
    } else {
      setMsg({ ...msg, [field]: "" });
    }
  }

  async function handleRegisterClick(e) {
    e.preventDefault();

    for (let field of Object.keys(msg)) {
      if (msg[field].length > 0) {
        alert(msg[field] + " — can't submit, please enter valid data");
        return;
      }
    }

    try {
      await axios.post(
        "https://campus-dashboard.onrender.com/user",
        user
      );

      alert("Registration Successful!");
      navigate("/login");
    } catch (err) {
      alert("Error during registration: " + err);
    }
  }

  return (
    <div className="parent">
      <div className="container-fluid text-center w-25 bdr">
        <h2>
          <span className="bi bi-person-fill"></span> Register User
        </h2>
        <form>
          <dl>
            <dt>User Name</dt>
            <dd>
              <input
                value={user.username}
                onChange={handleUserNameChange}
                onBlur={handleBlur}
                className="form-control"
                name="username"
              />
            </dd>
            <dd className={cls}>{msg.username}</dd>

            <dt>Password</dt>
            <dd>
              <input
                type="password"
                value={user.password}
                onChange={handlePasswordChange}
                onBlur={handleBlur}
                className="form-control"
                name="password"
              />
            </dd>
            <dd className={cls}>{msg.password}</dd>

            <dt>E-mail</dt>
            <dd>
              <input
                type="text"
                value={user.gmail}
                onChange={handleEmailChange}
                onBlur={handleBlur}
                className="form-control"
                name="gmail"
              />
            </dd>
            <dd className={cls}>{msg.gmail}</dd>

            <dt>Mobile</dt>
            <dd>
              <input
                type="text"
                value={user.mobile}
                onChange={handleMobileChange}
                onBlur={handleBlur}
                className="form-control"
                name="mobile"
              />
            </dd>
            <dd className={cls}>{msg.mobile}</dd>
          </dl>

          <button
            onClick={handleRegisterClick}
            className="btn bg-info text-white w-75"
          >
            Register
          </button>
        </form>

        <Link to="/login" className="text-white text-decoration-none">
          Already have an account? Login
        </Link>
      </div>
    </div>
  );
}
