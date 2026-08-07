import { useState, useEffect } from "react"
import { BsFillTrashFill, BsFillPencilFill } from "react-icons/bs";
import "../styles/JobTable.css"

function JobTable() {
    const [jobs, setJobs] = useState([]);
    const [isLoading, setIsLoading] = useState(true)

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
            <th scope="col">Actions</th>
          </tr>
        </thead>
        <tbody>
          {jobs.map((job, idx) => (
            <tr key={idx}>
              <th scope="row">{job.name}</th>
              <td>{job.customer}</td>
              <td>{job.created_at}</td>
              <td>{job.status}</td>
              <td>{job.payment_status}</td>
              <td>
              <span className="actions">
                <BsFillPencilFill className="edit-btn"  />
              </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
            // <div className="widgetLg">
            //     <h3 className="widgetLgTitle">Jobs</h3>
            //     <table className="widgetLgTable">
            //     <thead>
            //         <tr className="widgetLgTr">
            //             <th className="widgetLgTh">Name</th>
            //             <th className="widgetLgTh">Customer</th>
            //             <th className="widgetLgTh">Created-At</th>
            //             <th className="widgetLgTh">Status</th>
            //             <th className="widgetLgTh">Payment-Status</th>
            //         </tr>
            //         </thead>
            //         <tbody>
            //         {jobs && 
            //         jobs.map((job, idx) => (
            //             <tr key={idx}>
            //             <td className="widgetLgUser">{job.name}</td>
            //             <td className="widgetLgCustomer">{job.customer}</td>
            //             <td className="widgetLgCreated">{job.created_at}</td>
            //             <td className="widgetLgStatus">{job.status}</td>
            //             <td className="widgetLgPaymentStatus">{job.payment_status}</td>

            //             </tr>
            //         ))}
            //         </tbody>
            //     </table>
            // </div>
        )
}

export default JobTable;