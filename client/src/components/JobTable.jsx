import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { BsFillTrashFill, BsFillPencilFill } from "react-icons/bs";
import "../styles/JobTable.css"

function JobTable() {
    const [jobs, setJobs] = useState([]);
    const [isLoading, setIsLoading] = useState(true)
    const navigate = useNavigate();

    function convertTime(rawTime) {
        const fixedString = rawTime.replace(" ", "T").replace(/(\d{2}):(\d{6})$/, ".$1$2");
        const dateObj = new Date(fixedString);
        return dateObj.toLocaleString();
    }

    useEffect(() => {
        const token = localStorage.getItem("token");
        fetch("http://localhost:5000/api/jobs", {
            headers: {Authorization: `Bearer ${token}`},
        })
        .then((res) => {
            if (!res.ok) throw new Error("Invalid token");
            return res.json();
            })
            .then((data) => setJobs(data))
            .finally(() => setIsLoading(false))
        }, []);

        
    
        return (

        <div className="table-wrapper">
        <h1>Jobs</h1>
        <table className="table">
        
        <thead>
          <tr>
            <th scope="col" className="expand">
              Name
            </th>
            <th scope="col" className="expand">
              Customer
            </th>
            <th scope="col">Created-At</th>
            <th scope="col">Status</th>
            <th scope="col">Payment-Status</th>
          </tr>
        </thead>
        <tbody>
          {jobs.map((job, idx) => (
            <tr key={idx} onClick={() => navigate(`/jobs/${job.id}`)}>
              <th scope="row">{job.name}</th>
              <td>{job.customer}</td>
              <td>{convertTime(job.created_at)}</td>
              <td>{job.status}</td>
              <td>{job.payment_status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
        )
}

export default JobTable;