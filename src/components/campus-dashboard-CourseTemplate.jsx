import { Link } from "react-router-dom";

export function CourseTemplate({ dataObj }) {
  return (
    <div
      className="position-relative"
      style={{
        backgroundColor: "lightblue",
        width: "200px",
        height: "250px",
        padding: "10px",
        margin: "10px",
        boxShadow: "1px 1px 4px black",
      }}
    >
      <p><b>{dataObj.title}</b></p>
      <p>{dataObj.company}</p>
      <p>{dataObj.description}</p>

      <Link
        to={`/exampage/${dataObj._id}`}
        className="btn btn-primary w-50 position-absolute bottom-0 start-50 translate-middle-x"
      >
        View
      </Link>
    </div>
  );
}
