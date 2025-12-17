import {  Link, useNavigate } from "react-router-dom";
import { useCookies } from "react-cookie";
import { Home } from "./campus-dashboard-home";
import { Participants } from "./campus-dashboard-participants";

export function Nav() {
  const [cookie,setCookies,removeCookie] = useCookies();
  const navigate = useNavigate();
  function handleSignOut(){
    removeCookie("username");
    removeCookie("password");
    navigate("/login");
  }
  return (
      <div >
        <header>
          <h2 className=" p-2 mt-2 text-center">Campus Dashboard</h2>
          <nav>
            <div className="btn-toolbar bg-info justify-content-between ">
              <div className="btn-group">
                <Link className="btn btn-info text-white" to="/home">
                  <b>Home</b>
                </Link>
                <Link className="btn btn-info text-white" to="/participants">
                  <b>Participants</b>
                </Link>
                <Link className="btn btn-info text-white" to="/questionform">
                  <b>Schedule Exam</b>
                </Link>
              </div>
              <div>
            <button
  className="btn"
  style={{ color: "#000000", fontWeight : "bold", backgroundColor: "#06caf5ff" }}
>
  Sign Out
</button>


              </div>
            </div>
          </nav>
        </header>
      </div>)
}
