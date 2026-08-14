import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  BsFillTrashFill,
  BsFillPencilFill,
  BsArrowRightSquareFill,
} from "react-icons/bs";

function JobsTable({ user, jobs, editJob, deleteJob }) {
  const navigate = useNavigate();

  function convertTime(rawTime) {
    const fixedString = rawTime
      .replace(" ", "T")
      .replace(/(\d{2}):(\d{6})$/, ".$1$2");
    const dateObj = new Date(fixedString);
    return dateObj.toLocaleString();
  }

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
            {user.role === "MANAGER" && (
              <th scope="col" className="actions-col">
                Actions
              </th>
            )}
            <th scope="col" className="to-job-col">
              To Job
            </th>
          </tr>
        </thead>
        <tbody>
          {jobs.map((job, idx) => (
            <tr key={idx}>
              <th scope="row">{job.name}</th>
              <td>{job.customer}</td>
              <td>{convertTime(job.created_at)}</td>
              <td>{job.status}</td>
              <td>{job.payment_status}</td>
              {user.role === "MANAGER" && (
                <td>
                  <span className="actions">
                    <BsFillPencilFill
                      className="edit-btn"
                      onClick={() => editJob(idx)}
                    />
                    <BsFillTrashFill
                      className="delete-btn"
                      onClick={() => deleteJob(idx)}
                    />
                  </span>
                </td>
              )}
              <td>
                <span className="to-job">
                  <BsArrowRightSquareFill
                    className="nav-btn"
                    onClick={() => navigate(`/jobs/${job.id}`)}
                  />
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default JobsTable;
