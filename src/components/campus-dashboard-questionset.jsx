
export function Card()
{
  return(
    <div className="m-2 p-2 card text-center bg-light w-25" style={{height:"250px"}} >
          <div className="card-body">
            <p className="card-title">
              Test 1
            </p>
            <p className="card-subtitle">
              TCS interview questions cover various topics like language basics.
            </p>
            <div className="row">
              <div className="d-flex justify-content-around mt-2">
                <span>Total Questions</span>
                <span>Points</span>
              </div>
              <div className="d-flex justify-content-around mb-2">
                <span> 3</span>
                <span> <span className="bi bi-coin bg-warning rounded-circle text-danger "></span>  6</span>
              </div>
            </div>
          </div>
          <div className="card-footer">
            <button className="btn btn-primary text-white w-75">
              start
            </button>
          </div>
        </div>
  )
}