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



// import { useEffect, useState } from "react";
// import axios from "axios";
// import { useNavigate, Link } from "react-router-dom";
// import { useCookies } from "react-cookie";

// export function QuestionForm() {
//   const navigate = useNavigate();
//   const [cookies] = useCookies();

//   const [examData, setExamData] = useState({
//     id: "",
//     title: "",
//     company: "",
//     description: ""
//   });

//   const [questions, setQuestions] = useState([]);

//   const [currentQuestion, setCurrentQuestion] = useState({
//     q: "",
//     qtype: "",
//     options: ["", "", "", ""],
//     correct: []
//   });

//   useEffect(() => {
//     if (!cookies.username) navigate("/login");
//   }, []);

//   const handleAddQuestion = () => {
//     if (!currentQuestion.q || !currentQuestion.qtype) return;

//     let formatted;

//     if (currentQuestion.qtype === "nat") {
//       if (!currentQuestion.correct[0]) return;

//       formatted = {
//         q: currentQuestion.q,
//         qtype: "nat",
//         answer: currentQuestion.correct[0]
//       };
//     } else {
//       if (currentQuestion.correct.length === 0) return;

//       formatted = {
//         q: currentQuestion.q,
//         qtype: currentQuestion.qtype,
//         options: currentQuestion.options,
//         correct: currentQuestion.correct
//       };
//     }

//     setQuestions(prev => [...prev, formatted]);

//     setCurrentQuestion({
//       q: "",
//       qtype: "",
//       options: ["", "", "", ""],
//       correct: []
//     });
//   };

//   const handleSubmitExam = async () => {
//     if (!examData.id || !examData.title || questions.length === 0) return;

//     await axios.post(
//       "https://campus-dashboard.onrender.com/questionform",
//       {
//         ...examData,
//         questionset: questions
//       }
//     );

//     navigate("/home");
//   };

//   return (
//     <div className="container mt-4">
//       <h3>Create Exam</h3>

//       <input placeholder="Exam ID" onChange={e => setExamData(p => ({ ...p, id: e.target.value }))} />
//       <input placeholder="Title" onChange={e => setExamData(p => ({ ...p, title: e.target.value }))} />
//       <input placeholder="Company" onChange={e => setExamData(p => ({ ...p, company: e.target.value }))} />
//       <input placeholder="Description" onChange={e => setExamData(p => ({ ...p, description: e.target.value }))} />

//       <hr />

//       <label>
//         <input type="radio" value="mcq" checked={currentQuestion.qtype === "mcq"}
//           onChange={e => setCurrentQuestion({ q: "", qtype: e.target.value, options: ["", "", "", ""], correct: [] })} />
//         MCQ
//       </label>

//       <label>
//         <input type="radio" value="msq" checked={currentQuestion.qtype === "msq"}
//           onChange={e => setCurrentQuestion({ q: "", qtype: e.target.value, options: ["", "", "", ""], correct: [] })} />
//         MSQ
//       </label>

//       <label>
//         <input type="radio" value="nat" checked={currentQuestion.qtype === "nat"}
//           onChange={e => setCurrentQuestion({ q: "", qtype: e.target.value, options: [], correct: [] })} />
//         NAT
//       </label>

//       <input placeholder="Question" value={currentQuestion.q}
//         onChange={e => setCurrentQuestion(p => ({ ...p, q: e.target.value }))} />

//       {currentQuestion.qtype !== "nat" &&
//         currentQuestion.options.map((opt, i) => (
//           <input key={i} placeholder={`Option ${i + 1}`}
//             value={opt}
//             onChange={e => {
//               const o = [...currentQuestion.options];
//               o[i] = e.target.value;
//               setCurrentQuestion(p => ({ ...p, options: o }));
//             }} />
//         ))}

//       {currentQuestion.qtype === "mcq" &&
//         <select onChange={e => setCurrentQuestion(p => ({ ...p, correct: [Number(e.target.value)] }))}>
//           <option value="">Correct Option</option>
//           {currentQuestion.options.map((_, i) => <option key={i} value={i}>{i + 1}</option>)}
//         </select>
//       }

//       {currentQuestion.qtype === "msq" &&
//         currentQuestion.options.map((_, i) => (
//           <label key={i}>
//             <input type="checkbox"
//               checked={currentQuestion.correct.includes(i)}
//               onChange={() =>
//                 setCurrentQuestion(p => ({
//                   ...p,
//                   correct: p.correct.includes(i)
//                     ? p.correct.filter(x => x !== i)
//                     : [...p.correct, i]
//                 }))
//               } />
//             Option {i + 1}
//           </label>
//         ))
//       }

//       {currentQuestion.qtype === "nat" &&
//         <input placeholder="Correct Answer"
//           onChange={e => setCurrentQuestion(p => ({ ...p, correct: [e.target.value] }))} />
//       }

//       <button onClick={handleAddQuestion}>Add Question</button>
//       <button onClick={handleSubmitExam}>Submit Exam</button>

//       <Link to="/home">Back</Link>
//     </div>
//   );
// }
