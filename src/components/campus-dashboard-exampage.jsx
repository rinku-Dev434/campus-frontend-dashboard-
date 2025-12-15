import { useEffect, useState } from "react";
import { useCookies } from "react-cookie";
import { useNavigate, useParams, Link } from "react-router-dom";

export function Exampage() {
  const { testId } = useParams();
  const [cookies] = useCookies();
  const navigate = useNavigate();

  const [questionSet, setQuestionSet] = useState([]);
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(0);

  useEffect(() => {
    if (!cookies.username) navigate("/login");
  }, []);

  useEffect(() => {
    if (!testId) return;

    fetch(`https://campus-dashboard.onrender.com/tests/${testId}`)
      .then(res => res.json())
      .then(test => {
        const qs = (test.questionset || []).map(q => ({
          q: q.q || "",
          options: Array.isArray(q.options) ? q.options : [],
          correctIndex: Array.isArray(q.correct) ? q.correct[0] : null
        }));
        setQuestionSet(qs);
      })
      .catch(err => console.log(err));
  }, [testId]);

  const handleOptionChange = (qIndex, optIndex) => {
    if (submitted) return;
    setAnswers(prev => ({ ...prev, [qIndex]: optIndex }));
  };

  const handleSubmit = () => {
    let sc = 0;

    questionSet.forEach((q, idx) => {
      if (q.correctIndex === null) return;
      if (answers[idx] === q.correctIndex) sc++;
    });

    setScore(sc);
    setSubmitted(true);

    fetch("https://campus-dashboard.onrender.com/update-points", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        username: cookies.username,
        points: sc
      })
    });
  };

  return (
    <>
    <style>{`
/* ===== Page Background ===== */
body {
  margin: 0;
  background: #e6f2ff;
  font-family: Arial, Helvetica, sans-serif;
}

/* ===== Wrapper ===== */
.exam-wrapper {
  min-height: 100vh;
}

/* ===== Top Header ===== */
.exam-header {
  background: #1673ff;
  color: white;
  padding: 14px 20px;
  text-align: center;
  font-size: 22px;
  font-weight: bold;
}

/* ===== Content Area ===== */
.exam-content {
  max-width: 1100px;
  margin: 20px auto;
  padding: 0 16px;
}

/* ===== Question Card ===== */
.question-card {
  background: #fffdf4;
  border: 2px solid #7bbcf3;
  border-radius: 6px;
  padding: 18px 20px;
  margin-bottom: 22px;
}

/* ===== Question Title ===== */
.question-title {
  font-size: 16px;
  font-weight: bold;
  margin-bottom: 12px;
  color: #000;
}

/* ===== Options List ===== */
ol {
  padding-left: 22px;
}

/* ===== Option Item ===== */
.option {
  margin-bottom: 8px;
  padding: 4px 6px;
  border-radius: 4px;
}

/* ===== Correct / Wrong ===== */
.option.correct {
  color: #008000;
  font-weight: bold;
}

.option.wrong {
  color: #d40000;
  font-weight: bold;
}

/* ===== Labels ===== */
.option label {
  cursor: pointer;
}

/* ===== Radio ===== */
.option input[type="radio"] {
  margin-right: 6px;
  transform: scale(1.05);
}

/* ===== Bottom Buttons Area ===== */
.exam-actions {
  display: flex;
  justify-content: center;
  gap: 20px;
  margin: 30px 0 40px;
}

/* ===== Buttons ===== */
.submit-btn {
  background: #1673ff;
  color: white;
  border: none;
  padding: 10px 26px;
  font-size: 15px;
  font-weight: bold;
  border-radius: 4px;
  cursor: pointer;
}

.submit-btn:disabled {
  background: #9dbdf5;
  cursor: not-allowed;
}

/* ===== Back Button ===== */
.exam-actions a {
  background: #f0f0f0;
  color: #000;
  text-decoration: none;
  padding: 10px 26px;
  border: 1px solid #bbb;
  border-radius: 4px;
  font-weight: bold;
}

/* ===== Score ===== */
.score-box {
  text-align: center;
  font-size: 18px;
  font-weight: bold;
  color: #000;
  margin-top: 12px;
}
`}</style>


      <div className="exam-wrapper">
        <div className="exam-header">
          <h2>Online Examination</h2>
          
        </div>

        <div className="exam-content">
          {questionSet.map((q, idx) => (
            <div key={idx} className="question-card">
              <div className="question-title">
                Q{idx + 1}. {q.q}
              </div>

              <ol type="A">
                {q.options.map((opt, id) => {
                  let cls = "option";

                  if (submitted) {
                    if (id === q.correctIndex) cls += " correct";
                    else if (answers[idx] === id) cls += " wrong";
                  }

                  return (
                    <li key={id} className={cls}>
                      <label>
                        <input
                          type="radio"
                          name={`q_${idx}`}
                          checked={answers[idx] === id}
                          onChange={() => handleOptionChange(idx, id)}
                          disabled={submitted}
                        />
                        {opt}
                      </label>
                    </li>
                  );
                })}
              </ol>
            </div>
          ))}
          <div className="exam-actions">
  <Link to="/home">← Back</Link>

  <button
    className="submit-btn"
    onClick={handleSubmit}
    disabled={submitted}
  >
    Submit Exam
  </button>
</div>


          {submitted && (
            <div className="score-box">
              Score: {score} / {questionSet.length}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
