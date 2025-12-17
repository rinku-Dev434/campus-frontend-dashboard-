import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import { useCookies } from "react-cookie";

export function QuestionForm() {
  const navigate = useNavigate();
  const [cookies] = useCookies();

  const [examData, setExamData] = useState({
    id: "",
    title: "",
    company: "",
    description: ""
  });

  const [questions, setQuestions] = useState([]);

  const [currentQuestion, setCurrentQuestion] = useState({
    q: "",
    qtype: "",
    options: ["", "", "", ""],
    correct: []
  });

  useEffect(() => {
    if (!cookies.username) navigate("/login");
  }, []);

  const handleAddQuestion = () => {
    if (!currentQuestion.q || !currentQuestion.qtype) return;

    let formatted;

    if (currentQuestion.qtype === "nat") {
      if (!currentQuestion.correct[0]) return;

      formatted = {
        q: currentQuestion.q,
        qtype: "nat",
        correct: [currentQuestion.correct[0]]
      };
    } else {
      if (currentQuestion.correct.length === 0) return;

      formatted = {
        q: currentQuestion.q,
        qtype: currentQuestion.qtype,
        options: currentQuestion.options,
        correct: currentQuestion.correct
      };
    }

    setQuestions(prev => [...prev, formatted]);

    setCurrentQuestion({
      q: "",
      qtype: "",
      options: ["", "", "", ""],
      correct: []
    });
  };

  const handleSubmitExam = async () => {
    if (!examData.id || !examData.title || questions.length === 0) return;

    await axios.post("https://campus-dashboard.onrender.com/questionform", {
      ...examData,
      questionset: questions
    });

    navigate("/home");
  };

  return (
    <>
      {/* ===== RESTORED CSS ===== */}
      <style>{`
        .qf-wrapper {
          max-width: 800px;
          margin: 30px auto;
          padding: 25px;
          background: #0d6efd;
          color: white;
          border-radius: 10px;
          box-shadow: 0 0 10px rgba(0,0,0,0.2);
        }

        .qf-wrapper h3,
        .qf-wrapper h5,
        .qf-wrapper h6 {
          color: white;
        }

        .qf-wrapper input,
        .qf-wrapper select {
          margin-bottom: 10px;
        }

        .qf-card {
          background: white;
          color: black;
          padding: 10px;
          border-radius: 6px;
          margin-bottom: 10px;
        }
      `}</style>

      <div className="qf-wrapper">
        <h3>Create Exam</h3>

        <input
          className="form-control"
          placeholder="Exam ID"
          onChange={e => setExamData(p => ({ ...p, id: e.target.value }))}
        />

        <input
          className="form-control"
          placeholder="Title"
          onChange={e => setExamData(p => ({ ...p, title: e.target.value }))}
        />

        <input
          className="form-control"
          placeholder="Company"
          onChange={e => setExamData(p => ({ ...p, company: e.target.value }))}
        />

        <input
          className="form-control"
          placeholder="Description"
          onChange={e => setExamData(p => ({ ...p, description: e.target.value }))}
        />

        <hr />

        <h5>Add Question</h5>

        {["mcq", "msq", "nat"].map(t => (
          <label key={t} className="me-3">
            <input
              type="radio"
              checked={currentQuestion.qtype === t}
              onChange={() =>
                setCurrentQuestion({
                  q: "",
                  qtype: t,
                  options: ["", "", "", ""],
                  correct: []
                })
              }
            />{" "}
            {t.toUpperCase()}
          </label>
        ))}

        <input
          className="form-control mt-2"
          placeholder="Question"
          value={currentQuestion.q}
          onChange={e =>
            setCurrentQuestion(p => ({ ...p, q: e.target.value }))
          }
        />

        {currentQuestion.qtype !== "nat" &&
          currentQuestion.options.map((opt, i) => (
            <input
              key={i}
              className="form-control"
              placeholder={`Option ${i + 1}`}
              value={opt}
              onChange={e => {
                const o = [...currentQuestion.options];
                o[i] = e.target.value;
                setCurrentQuestion(p => ({ ...p, options: o }));
              }}
            />
          ))}

        {currentQuestion.qtype === "mcq" && (
          <select
            className="form-select"
            onChange={e =>
              setCurrentQuestion(p => ({
                ...p,
                correct: [Number(e.target.value)]
              }))
            }
          >
            <option value="">Correct option</option>
            {currentQuestion.options.map((_, i) => (
              <option key={i} value={i}>{i + 1}</option>
            ))}
          </select>
        )}

        {currentQuestion.qtype === "msq" &&
          currentQuestion.options.map((_, i) => (
            <label key={i} className="d-block">
              <input
                type="checkbox"
                checked={currentQuestion.correct.includes(i)}
                onChange={() =>
                  setCurrentQuestion(p => ({
                    ...p,
                    correct: p.correct.includes(i)
                      ? p.correct.filter(x => x !== i)
                      : [...p.correct, i]
                  }))
                }
              /> Option {i + 1}
            </label>
          ))}

        {currentQuestion.qtype === "nat" && (
          <input
            className="form-control"
            placeholder="Correct Answer"
            onChange={e =>
              setCurrentQuestion(p => ({ ...p, correct: [e.target.value] }))
            }
          />
        )}

        <div className="d-flex justify-content-between mt-3">
          <Link to="/home" className="btn btn-info text-white">
            Back
          </Link>

          <button className="btn btn-secondary" onClick={handleAddQuestion}>
            Add Question
          </button>

          <button className="btn btn-success" onClick={handleSubmitExam}>
            Submit Exam
          </button>
        </div>

        <hr />

        <h6>Questions Added: {questions.length}</h6>
        {questions.map((q, i) => (
          <div key={i} className="qf-card">
            <b>Q{i + 1}:</b> {q.q} ({q.qtype.toUpperCase()})
          </div>
        ))}
      </div>
    </>
  );
}
