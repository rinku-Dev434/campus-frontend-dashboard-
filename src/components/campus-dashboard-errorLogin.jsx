import { Link } from "react-router-dom"

export function ErrorPage()
{
  return(
    <div className="container-fluid text-center">
      <h2 className="text-danger text-center" >Invalid Credentials</h2>
      <Link to="/login" >Try-Again</Link>
    </div>
  )
}