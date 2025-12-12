import { useEffect, useState } from "react";
import { useCookies } from "react-cookie";
import { useNavigate, Link } from "react-router-dom";

export function Exampage() {
  const [cookies] = useCookies();
  const navigate = useNavigate();

  const [questionSet, setQuestionSet] = useState([]);
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(0);

  // 🔥 AUTH CHECK
  useEffect(() => {
    if (!cookies.username) {
      navigate("/login");
    }
  }, []);

  // 🔥 FETCH FIRST QUIZ WITHOUT ID
  useEffect(() => {
    fetch("https://campus-dashboard.onrender.com/tests")
      .then((res) => res.json())
      .then((data) => {
        console.log("Fetched tests:", data);

        if (data.length > 0) {
          setQuestionSet(data[0].questionset || []);
        }
      })
      .catch((err) => console.log("Error fetching tests:", err));
  }, []);

  // Handle answer selection
  const handleOptionChange = (qIndex, optIndex) => {
    setAnswers((prev) => ({ ...prev, [qIndex]: optIndex }));
  };

  const handleSubmit = () => {
    let sc = 0;

    questionSet.forEach((q, idx) => {
      const correct = q.answers[0]; // backend format
      const correctIndex = q.options.indexOf(correct);
      const userAns = answers[idx];

      if (userAns === correctIndex) sc++;
    });

    setScore(sc);
    setSubmitted(true);

    // update the score in database 
      fetch("https://campus-dashboard.onrender.com/update-points", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      username: cookies.username,
      points: sc
    }),
  })
    .then((res) => res.json())
    .then((data) => console.log("Points updated:", data))
    .catch((err) => console.log("Error updating points:", err));
  };

  return (
    <div className="container-fluid">
      <h2 className="text-center bg-primary text-light p-2">Exam</h2>

      <div className="p-3" style={{ minHeight: "100vh" }}>
        {questionSet.length > 0 ? (
          questionSet.map((q, idx) => {
            const userAns = answers[idx];
            const correct = q.answers[0];
            const correctIndex = q.options.indexOf(correct);

            return (
              <div key={idx} className="bg-white p-3 mb-3 rounded shadow-sm">
                <b>Q{idx + 1}:</b> {q.q}
                <ol className="mt-2" type="A">
                  {q.options.map((opt, id) => {
                    let cls = "";
                    if (submitted) {
                      if (id === correctIndex) cls = "text-success fw-bold";
                      else if (id === userAns) cls = "text-danger";
                    }

                    return (
                      <li key={id}>
                        <label className={cls}>
                          <input
                            type="radio"
                            name={`q_${idx}`}
                            checked={userAns === id}
                            onChange={() => handleOptionChange(idx, id)}
                            className="me-2"
                          />
                          {opt}
                        </label>
                      </li>
                    );
                  })}
                </ol>
              </div>
            );
          })
        ) : (
          <h4 className="text-muted">Loading questions...</h4>
        )}

        <div className="text-center mt-3">
          <Link className="btn btn-info me-3" to="/home">
            Back to Home
          </Link>
          <button className="btn btn-primary" onClick={handleSubmit}>
            Submit
          </button>
        </div>

        {submitted && (
          <h4 className="text-center mt-3">
            Score: {score} / {questionSet.length}
          </h4>
        )}
      </div>
    </div>
  );
}
