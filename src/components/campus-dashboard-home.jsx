import { useState, useEffect } from "react";
import { CourseTemplate } from "./campus-dashboard-CourseTemplate";
import { Footer } from "./campus-dashboard-footer";
import { Nav } from "./campus-dashboard-nav";
import { useNavigate } from "react-router-dom";
import { useCookies } from "react-cookie";

export function Home() {
  const [questions, setQuestions] = useState([]);
  const navigate = useNavigate();
  const [cookies] = useCookies();

  function LoadQuestions() {
    fetch("https://campus-dashboard.onrender.com/tests")
      .then((response) => response.json())
      .then((data) => {
        setQuestions(data);
      })
      .catch((err) => {
        console.log("Error loading questions:", err);
      });
  }

  useEffect(() => {
    if (!cookies.username) {
      navigate("/login");
    }

    LoadQuestions();
  }, []);

  return (
    <div className="container-fluid">
      <Nav />
      <h2 className="text-center text-primary">Welcome to Campus Dashboard!</h2>
      <hr />

      <div className="d-flex flex-wrap p-2">
        {questions.map((ele, idx) => (
          <CourseTemplate dataObj={{ ...ele }} key={"ct" + idx} />
        ))}
      </div>

      <hr />
      <div className="mb-4"></div>
      <Footer />
    </div>
  );
}
