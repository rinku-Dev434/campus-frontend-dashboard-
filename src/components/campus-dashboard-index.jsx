import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./campus-dashboard-all.css";
import { Home } from "./campus-dashboard-home";
import { Register } from "./campus-dashboard-register";
import { Login } from "./campus-dashboard-login";
import { Participants } from "./campus-dashboard-participants";
import { ErrorPage } from "./campus-dashboard-errorLogin";
import { Exampage } from "./campus-dashboard-exampage";
import { QuestionForm } from "./campus-dashboard-QuestionForm";

export function CampusIndex() {
  
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login/>} ></Route>
        <Route path="/home" element={<Home/>} ></Route>
        <Route path="/login" element={<Login/>} ></Route>
        <Route path="/register" element={<Register/>} ></Route>
        <Route path="/participants" element={<Participants/>} ></Route>
        <Route path="/questionform" element={<QuestionForm/>} ></Route>
        <Route path="/contact" element={<h2>Contact</h2>} ></Route>
        <Route path="/exampage" element={<Exampage/>} ></Route>
        <Route path="/error" element={<ErrorPage/>}
        />
        <Route path="/*" element={<h2 className="text-danger text-center">404 Page Not Found</h2>} ></Route>
      </Routes>
    </BrowserRouter>
  );
}
