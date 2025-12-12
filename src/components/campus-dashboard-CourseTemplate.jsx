import { Link } from "react-router-dom";

export function CourseTemplate(props) {
  const { dataObj } = props;
  
  return (
    <div
      className="position-relative"
      style={{
        backgroundColor: "lightblue",
        width: "200px",
        height: "250px",
        padding: "10px",
        margin:"10px",
        boxShadow: "1px 1px 4px black",
      }}
    >
      <p><b>{dataObj.id}</b></p>
      <p>{dataObj.company}</p>
      <p style={{wordSpacing:"10px"}}>{(dataObj.description).toUpperCase()}</p>

      <Link
        to="/exampage"
        style={{ bottom: "20px" }}
        state={dataObj}
        className="btn btn-primary w-50 position-absolute text-center text-white text-decoration-none"
      >
        View
      </Link>
    </div>
  );
}
