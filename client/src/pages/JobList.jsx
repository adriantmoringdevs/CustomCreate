import JobsTable from "../components/tables/JobsTable";
import NewJobForm from "../components/forms/NewJobForm";
import EditJobForm from "../components/forms/EditJobForm";
import DeleteConfirm from "../components/DeleteConfirm";
import { useState, useEffect } from "react";
import { useAuth } from "../context/UserContext";

function JobList() {
  const [jobs, setJobs] = useState([]);
  const [jobFormOpen, setJobFormOpen] = useState(false);
  const [editJobFormOpen, setEditJobFormOpen] = useState(false);
  const [jobToEdit, setJobToEdit] = useState(null);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [jobToDelete, setJobToDelete] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    const token = localStorage.getItem("token");
    fetch("http://localhost:5000/api/jobs", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => {
        if (!res.ok) throw new Error("Invalid token");
        return res.json();
      })
      .then((data) => setJobs(data))
      .finally(() => setIsLoading(false));
  }, []);

  function addJob(newJob) {
    setJobs((prevJobs) => [...prevJobs, newJob]);
  }

  function handleEditJob(idx) {
    setJobToEdit(idx);
    setEditJobFormOpen(true);
  }

  function saveEditedJob(job) {
    const token = localStorage.getItem("token");
    fetch("http://localhost:5000/api/jobs", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      credentials: "include",
      body: JSON.stringify(job),
    })
      .then((res) => {
        if (res.ok) {
          return res.json();
        }
        throw new Error(`Failed to update job ${job.id}`);
      })
      .then((data) => {
        setJobs((prevJobs) =>
          prevJobs.map((job) => (job.id === data.id ? data : job)),
        );
      });
  }

  function handleDeleteJobSelect(idx) {
    setJobToDelete(idx);
    setDeleteOpen(true);
  }

  function handleDeleteJob(jobToDelete) {
    const token = localStorage.getItem("token");
    fetch("http://localhost:5000/api/jobs", {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      credentials: "include",
      body: JSON.stringify(jobToDelete),
    })
      .then((res) => {
        if (res.ok) {
          return res.json();
        }
        throw new Error("Job deletion failed");
      })
      .then(() => {
        setJobs((prevJobs) =>
          prevJobs.filter((job) => job.id != jobToDelete.id),
        );
      })
      .catch((err) => {
        console.error("Error deleting job:", err)
      })
  }

  return (
    <div>
      <JobsTable
        jobs={jobs}
        editJob={handleEditJob}
        deleteJob={handleDeleteJobSelect}
        user={user}
      />
      {user.role === "MANAGER" && (
        <button className="btn" onClick={() => setJobFormOpen(true)}>
          Add Job
        </button>
      )}
      {jobFormOpen && (
        <NewJobForm
          addJob={addJob}
          closeForm={() => {
            setJobFormOpen(false);
          }}
        />
      )}
      {editJobFormOpen && (
        <EditJobForm
          saveEditedJob={saveEditedJob}
          closeForm={() => {
            setEditJobFormOpen(false);
          }}
          jobToEdit={jobToEdit !== null && jobs[jobToEdit]}
        />
      )}
      {deleteOpen && (
        <DeleteConfirm
          deleteJob={handleDeleteJob}
          jobToDelete={jobToDelete !== null && jobs[jobToDelete]}
        />
      )}
    </div>
  );
}

export default JobList;
