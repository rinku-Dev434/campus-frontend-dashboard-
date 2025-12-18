import { useEffect, useState } from "react";
import { useCookies } from "react-cookie";
import { useNavigate, useParams } from "react-router-dom";

export function Exampage() {
  const { testId } = useParams();
  const navigate = useNavigate();
  const [cookies] = useCookies(["username"]);

  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(0);

  useEffect(() => {
    if (!cookies.username) {
      navigate("/login", { replace: true });
    }
  }, [cookies.username, navigate]);

  useEffect(() => {
    fetch(`https://campus-dashboard.onrender.com/tests/${testId}`)
      .then(res => res.json())
      .then(data => setQuestions(data.questionset || []));
  }, [testId]);

  const handleSubmit = async () => {
    let sc = 0;

    questions.forEach((q, i) => {
      const userAns = answers[i];

      if (q.qtype === "nat") {
        const ua = userAns?.trim().toLowerCase();
        const ca = q.correct[0].trim().toLowerCase();
        if (ua === ca) sc++;
      }

      if (q.qtype === "mcq") {
        if (userAns === q.correct[0]) sc++;
      }

      if (q.qtype === "msq") {
        const a = userAns || [];
        if (
          a.length === q.correct.length &&
          a.every(x => q.correct.includes(x))
        ) sc++;
      }
    });

    setScore(sc);
    setSubmitted(true);

    try {
      await fetch("https://campus-dashboard.onrender.com/update-points", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          username: cookies.username,
          points: sc
        })
      });
    } catch (err) {
      console.error("Score update failed", err);
    }
  };

  const handleBackButton = () => {
    if (submitted) {
      navigate("/home", { replace: true });
    } else {
      navigate(-1);
    }
  };

  return (
    <>
      <style>{`
        body {
          margin: 0;
          background: #e6f2ff;
          font-family: Arial, Helvetica, sans-serif;
        }

        .exam-wrapper {
          min-height: 100vh;
        }

        .exam-header {
          background: #1673ff;
          color: white;
          padding: 14px;
          text-align: center;
          font-size: 22px;
          font-weight: bold;
        }

        .exam-content {
          max-width: 1000px;
          margin: 20px auto;
          padding: 0 16px;
        }

        .question-card {
          background: #fffdf4;
          border: 2px solid #7bbcf3;
          border-radius: 6px;
          padding: 18px;
          margin-bottom: 22px;
        }

        .question-title {
          font-weight: bold;
          margin-bottom: 12px;
        }

        .option {
          margin-bottom: 8px;
        }

        .correct {
          color: green;
          font-weight: bold;
        }

        .wrong {
          color: red;
          font-weight: bold;
        }

        .answer-box {
          margin-top: 8px;
          font-weight: bold;
          color: green;
        }

        .exam-actions {
          display: flex;
          justify-content: center;
          gap: 20px;
          margin: 30px 0;
        }

        .submit-btn {
          background: #1673ff;
          color: white;
          border: none;
          border-radius: 10px;
          padding: 10px 26px;
          font-weight: bold;
          cursor: pointer;
        }

        .back-btn {
          background: #220c58fe;
          color: white;
          border-radius: 5px;
          border: none;
          padding: 10px 26px;
          font-weight: bold;
          cursor: pointer;
        }

        .submit-btn:disabled {
          background: #9dbdf5;
          cursor: not-allowed;
        }

        .score-box {
          text-align: center;
          font-size: 18px;
          font-weight: bold;
        }
      `}</style>

      <div className="exam-wrapper">
        <div className="exam-header">Online Examination</div>

        <div className="exam-content">
          {questions.map((q, i) => {
            const userAns = answers[i];

            return (
              <div key={i} className="question-card">
                <div className="question-title">
                  Q{i + 1}. {q.q}
                </div>

                {q.qtype === "nat" && (
                  <>
                    <input
                      type="text"
                      disabled={submitted}
                      value={userAns || ""}
                      onChange={e =>
                        setAnswers(p => ({ ...p, [i]: e.target.value }))
                      }
                    />

                    {submitted && (
                      <div className="answer-box">
                        Correct Answer: {q.correct[0]}
                      </div>
                    )}
                  </>
                )}

                {q.qtype === "mcq" &&
                  q.options.map((opt, idx) => {
                    let cls = "option";
                    if (submitted) {
                      if (idx === q.correct[0]) cls += " correct";
                      else if (userAns === idx) cls += " wrong";
                    }

                    return (
                      <div key={idx} className={cls}>
                        <label>
                          <input
                            type="radio"
                            name={`q_${i}`}
                            disabled={submitted}
                            checked={userAns === idx}
                            onChange={() =>
                              setAnswers(p => ({ ...p, [i]: idx }))
                            }
                          />{" "}
                          {opt}
                        </label>
                      </div>
                    );
                  })}

                {q.qtype === "msq" &&
                  q.options.map((opt, idx) => {
                    const selected = userAns?.includes(idx);
                    const correct = q.correct.includes(idx);

                    let cls = "option";
                    if (submitted) {
                      if (correct) cls += " correct";
                      else if (selected && !correct) cls += " wrong";
                    }

                    return (
                      <div key={idx} className={cls}>
                        <label>
                          <input
                            type="checkbox"
                            disabled={submitted}
                            checked={selected || false}
                            onChange={() =>
                              setAnswers(p => {
                                const arr = p[i] || [];
                                return {
                                  ...p,
                                  [i]: arr.includes(idx)
                                    ? arr.filter(x => x !== idx)
                                    : [...arr, idx]
                                };
                              })
                            }
                          />{" "}
                          {opt}
                        </label>
                      </div>
                    );
                  })}
              </div>
            );
          })}

          <div className="exam-actions">
            <button
              type="button"
              className="back-btn"
              onClick={handleBackButton}
            >
              ⬅ Back
            </button>

            <button
              type="button"
              className="submit-btn"
              onClick={handleSubmit}
              disabled={submitted}
            >
              Submit Exam
            </button>
          </div>

          {submitted && (
            <div className="score-box">
              Score: {score} / {questions.length}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
