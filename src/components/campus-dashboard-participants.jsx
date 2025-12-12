import { useEffect, useState } from "react";
import { Nav } from "./campus-dashboard-nav";
import { useCookies } from "react-cookie";
import { Link, useNavigate } from "react-router-dom";

export function Participants() {
  const [data,setData] = useState([]);
  const [cookies,setCookies,removeCookies] = useCookies();
  const navigate = useNavigate();
  
  function LoadData(){
      fetch("https://campus-dashboard.onrender.com/users")
      .then((response)=>response.json())
      .then((data)=>{
        setData(data);
      })
    }
    useEffect(()=>{
      if (!cookies.username) {
      navigate("/login");
    }
      LoadData(); // 
    },[]);
  

  return (
    <div className="container-fluid">
      <Nav/>
      <div className="container">
        <h3 className="mb-4 text-center">Leaderboard</h3>
        <Link className="btn btn-link" to="/home">back to home</Link>
        <table className="table table-bordered table-striped text-center table-hover">
          <thead className="table-primary">
            <tr>
              <th>Rank</th>
              <th>Name</th>
              <th>Points</th>
            </tr>
          </thead>
          <tbody id="table-body">
            {data.map((ele, idx) => {
              return (
                <tr key={"tr_" + idx}>
                  <td>{idx+1}</td>
                  <td>{ele.username}</td>
                  <td>{ele.points}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
