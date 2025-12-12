import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useCookies } from "react-cookie";
import { Link } from "react-router-dom";

export function QuestionForm() {
  const [examData, setExamData] = useState({
    id: "",
    title: "",
    numberOfQuestions: 0,
    company: "",
    description: "",
  });
  const navigate = useNavigate();
  const [cookies,setCookies,removeCookies] = useCookies();
  const [questions, setQuestions] = useState([]);

  const [currentQuestion, setCurrentQuestion] = useState({
    q: "",
    qtype: "",
    options: ["", "", "", ""],
    correct: [],
  });

  useEffect(()=>{
     if (!cookies.username) {
      navigate("/login");
    }
  },[]);

  // Handle exam metadata changes
  const handleExamChange = (field, value) => {
    setExamData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  // Handle question text and type
  const handleQuestionTextChange = (value) => {
    setCurrentQuestion((prev) => ({ ...prev, q: value }));
  };

  const handleQuestionTypeChange = (value) => {
    setCurrentQuestion({
      q: "",
      qtype: value,
      options: ["", "", "", ""],
      correct: [],
    });
  };

  // Handle option text change
  const handleOptionChange = (index, value) => {
    const updated = [...currentQuestion.options];
    updated[index] = value;
    setCurrentQuestion((prev) => ({ ...prev, options: updated }));
  };

  // Handle correct answer changes
  const handleCorrectChange = (value) => {
    if (currentQuestion.qtype === "mcq") {
      setCurrentQuestion((prev) => ({ ...prev, correct: [value] }));
    } else if (currentQuestion.qtype === "msq") {
      setCurrentQuestion((prev) => {
        const exists = prev.correct.includes(value);
        const updated = exists
          ? prev.correct.filter((v) => v !== value)
          : [...prev.correct, value];
        return { ...prev, correct: updated };
      });
    } else if (currentQuestion.qtype === "nat") {
      setCurrentQuestion((prev) => ({ ...prev, correct: [value] }));
    }
  };

  // Add question
  const handleAddQuestion = () => {
    if (!currentQuestion.q.trim()) {
      alert("Question text cannot be empty");
      return;
    }

    if (currentQuestion.correct.length === 0) {
      alert("Please select the correct answer");
      return;
    }

    setQuestions((prev) => [...prev, currentQuestion]);

    // Reset
    setCurrentQuestion({
      q: "",
      qtype: "",
      options: ["", "", "", ""],
      correct: [],
    });
  };

  // Submit full exam
  const handleSubmitExam = () => {
    if (!examData.id || !examData.title) {
      alert("Please fill in exam ID and title");
      return;
    }
    if (questions.length === 0) {
      alert("Please add at least one question");
      return;
    }

    const fullExamData = {
      ...examData,
      numberOfQuestions: questions.length,
      questionset: questions,
    };

    axios({
      method: "post",
      url: "http://127.0.0.1:9000/questionsets",
      data: fullExamData,
    });
    navigate("/home");

    alert(JSON.stringify(fullExamData, null, 2));

    console.log("Exam Data:", fullExamData);
  };

  return (
    <div
    className="container-fluid mt-4 mb-4 p-4 bg-primary text-light rounded shadow"
    style={{ maxWidth: "800px" }}
    >
      <h3>Create Exam</h3>

      {/* Exam Metadata */}
      <form>
        <div className="mb-2">
          <label>Exam ID</label>
          <input
            className="form-control"
            value={examData.id}
            onChange={(e) => handleExamChange("id", e.target.value)}
          />
        </div>

        <div className="mb-2">
          <label>Title</label>
          <input
            className="form-control"
            value={examData.title}
            onChange={(e) => handleExamChange("title", e.target.value)}
          />
        </div>

        <div className="mb-2">
          <label>Company</label>
          <input
            className="form-control"
            value={examData.company}
            onChange={(e) => handleExamChange("company", e.target.value)}
          />
        </div>

        <div className="mb-2">
          <label>Description</label>
          <input
            className="form-control"
            value={examData.description}
            onChange={(e) => handleExamChange("description", e.target.value)}
          />
        </div>
      </form>

      <hr style={{ height: "2px", backgroundColor: "white", border: "none" }} />

      {/* Question Section */}
      <h5>Add Question</h5>

      <div className="mb-2">
        <label>Question Type</label>
        <div>
          {["mcq", "msq", "nat"].map((type) => (
            <label key={type} className="me-3">
              <input
                name="qtype"
                type="radio"
                value={type}
                checked={currentQuestion.qtype === type}
                onChange={(e) => handleQuestionTypeChange(e.target.value)}
              />{" "}
              {type.toUpperCase()}
            </label>
          ))}
        </div>
      </div>

      <div className="mb-2">
        <label>Question Text</label>
        <input
          className="form-control"
          value={currentQuestion.q}
          onChange={(e) => handleQuestionTextChange(e.target.value)}
        />
      </div>

      {/* Conditional Sections */}
      {currentQuestion.qtype === "mcq" && (
        <div>
          <h6>MCQ Options</h6>
          {currentQuestion.options.map((opt, idx) => (
            <div className="mb-2" key={idx}>
              <label>Option {idx + 1}</label>
              <input
                className="form-control"
                value={opt}
                onChange={(e) => handleOptionChange(idx, e.target.value)}
              />
            </div>
          ))}
          <div className="mb-2">
            <label>Correct Answer</label>
            <select
              className="form-select"
              value={currentQuestion.correct[0] ?? ""}
              onChange={(e) => handleCorrectChange(Number(e.target.value))}
            >
              <option value="">Select correct option</option>
              {currentQuestion.options.map((opt, idx) => (
                <option key={idx} value={idx}>
                  {opt || `Option ${idx + 1}`}
                </option>
              ))}
            </select>
          </div>
        </div>
      )}

      {currentQuestion.qtype === "msq" && (
        <div>
          <h6>MSQ Options</h6>
          {currentQuestion.options.map((opt, idx) => (
            <div key={idx} className="form-check mb-2">
              <input
                type="checkbox"
                className="form-check-input"
                id={`msq-${idx}`}
                checked={currentQuestion.correct.includes(idx)}
                onChange={() => handleCorrectChange(idx)}
              />
              <label className="form-check-label" htmlFor={`msq-${idx}`}>
                {opt || `Option ${idx + 1}`}
              </label>
              <input
                className="form-control mt-1"
                value={opt}
                onChange={(e) => handleOptionChange(idx, e.target.value)}
              />
            </div>
          ))}
        </div>
      )}

      {currentQuestion.qtype === "nat" && (
        <div>
          <h6>NAT Answer</h6>
          <input
            type="text"
            className="form-control"
            placeholder="Enter correct answer"
            value={currentQuestion.correct[0] ?? ""}
            onChange={(e) => handleCorrectChange(e.target.value)}
          />
        </div>
      )}

      {!currentQuestion.qtype && (
        <h6 className="text-warning">Choose Question Type</h6>
      )}

      {/* Buttons */}
      <div className="d-flex justify-content-between mt-3">
    <Link to="/home" className="btn btn-info text-white" >back to home</Link>

        <button
          type="button"
          className="btn btn-secondary"
          onClick={handleAddQuestion}
        >
          Add Question +
        </button>

        <button
          type="button"
          className="btn btn-success"
          onClick={handleSubmitExam}
        >
          Submit Exam
        </button>
      </div>

      <hr />

      {/* Display Questions */}
      <h5>Questions Added: {questions.length}</h5>
      {questions.map((q, idx) => (
        <div key={idx} className="p-2 mb-2 border rounded bg-white text-dark">
          <strong>Q{idx + 1}:</strong> {q.q} ({q.qtype.toUpperCase()})
          {q.qtype !== "nat" && (
            <ol>
              {q.options.map((opt, id) => (
                <li key={id}>
                  {opt} {q.correct.includes(id) && <strong>(Correct)</strong>}
                </li>
              ))}
            </ol>
          )}
          {q.qtype === "nat" && (
            <p>
              <strong>Answer:</strong> {q.correct[0]}
            </p>
          )}
        </div>
      ))}
    </div>
  );
}
